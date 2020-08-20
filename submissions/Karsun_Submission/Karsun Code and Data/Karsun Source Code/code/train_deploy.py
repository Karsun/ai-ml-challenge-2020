import os
import argparse
import json
import logging
import sys

import transformers
import torch
import torch.utils.data
import torch.utils.data.distributed
import numpy as np
import pandas as pd
import torch.nn.functional as F

from transformers import BertModel, BertTokenizer, BertConfig, AdamW, get_linear_schedule_with_warmup
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report, brier_score_loss
from collections import defaultdict
from torch import nn, optim
from torch.utils.data import Dataset, DataLoader
from pytorch_pretrained_bert.file_utils import WEIGHTS_NAME, CONFIG_NAME

logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)
logger.addHandler(logging.StreamHandler(sys.stdout))

PRE_TRAINED_MODEL_NAME = 'bert-base-cased'
CLASS_NAMES=['Acceptable', 'Unacceptable']
MAX_LEN = 128
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)
torch.manual_seed(RANDOM_SEED)
tokenizer = BertTokenizer.from_pretrained(PRE_TRAINED_MODEL_NAME)

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
device

class EulaDataset(Dataset):

    def __init__(self, doc, targets, tokenizer, max_len):
        self.doc = doc
        self.targets = targets
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.doc)

    def __getitem__(self, item):
        doc = str(self.doc[item])
        target = self.targets[item]

        encoding = self.tokenizer.encode_plus(
                    doc,
                    add_special_tokens=True,
                    truncation=True,
                    max_length=self.max_len,
                    return_token_type_ids=False,
                    pad_to_max_length=True,
                    return_attention_mask=True,
                    return_tensors='pt',
        )

        return {
            'doc_text': doc,
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'targets': torch.tensor(target, dtype=torch.long)
            }

    
def create_data_loader(df, tokenizer, max_len, batch_size):
    ds = EulaDataset(
        doc=df.text.to_numpy(),
        targets=df.label.to_numpy(),
        tokenizer=tokenizer,
        max_len=max_len
      )

    return DataLoader(
        ds,
        batch_size=batch_size,
        num_workers=4
        )


class EulaClassifier(nn.Module):
    def __init__(self, n_classes):
        super(EulaClassifier, self).__init__()
        self.bert = BertModel.from_pretrained(PRE_TRAINED_MODEL_NAME)
        self.drop = nn.Dropout(p=0.3)
        self.out = nn.Linear(self.bert.config.hidden_size, n_classes)

    def forward(self, input_ids, attention_mask):
        _, pooled_output = self.bert(
          input_ids=input_ids,
          attention_mask=attention_mask
        )
        output = self.drop(pooled_output)
        return self.out(output)
    

def train_epoch(
  model,
  data_loader,
  loss_fn,
  optimizer,
  device,
  scheduler,
  n_examples
    ):
    model = model.train()

    losses = []
    correct_predictions = 0

    for d in data_loader:
        input_ids = d["input_ids"].to(device)
        attention_mask = d["attention_mask"].to(device)
        targets = d["targets"].to(device)

        outputs = model(
          input_ids=input_ids,
          attention_mask=attention_mask
        )

        _, preds = torch.max(outputs, dim=1)
        loss = loss_fn(outputs, targets)

        correct_predictions += torch.sum(preds == targets)
        losses.append(loss.item())

        loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        optimizer.step()
        scheduler.step()
        optimizer.zero_grad()

    return correct_predictions.double() / n_examples, np.mean(losses)

def eval_model(model, data_loader, loss_fn, device, n_examples):
    model = model.eval()

    losses = []
    correct_predictions = 0

    with torch.no_grad():
        for d in data_loader:
            input_ids = d["input_ids"].to(device)
            attention_mask = d["attention_mask"].to(device)
            targets = d["targets"].to(device)

            outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask
            )
            _, preds = torch.max(outputs, dim=1)

            loss = loss_fn(outputs, targets)

            correct_predictions += torch.sum(preds == targets)
            losses.append(loss.item())

    return correct_predictions.double() / n_examples, np.mean(losses)


def get_predictions(model, data_loader):
    model = model.eval()

    review_texts = []
    predictions = []
    prediction_probs = []
    real_values = []

    with torch.no_grad():
        for d in data_loader:

            texts = d["doc_text"]
            input_ids = d["input_ids"].to(device)
            attention_mask = d["attention_mask"].to(device)
            targets = d["targets"].to(device)

            outputs = model(
            input_ids=input_ids,
            attention_mask=attention_mask
            )
            _, preds = torch.max(outputs, dim=1)

            probs = F.softmax(outputs, dim=1)

            review_texts.extend(texts)
            predictions.extend(preds)
            prediction_probs.extend(probs)
            real_values.extend(targets)

    predictions = torch.stack(predictions).cpu()
    prediction_probs = torch.stack(prediction_probs).cpu()
    real_values = torch.stack(real_values).cpu()
    return review_texts, predictions, prediction_probs, real_values


def train (args):
    
    is_distributed = len(args.hosts) > 1 and args.backend is not None
    logger.debug("Distributed training - %s", is_distributed)
    use_cuda = args.num_gpus > 0
    logger.debug("Number of gpus available - %d", args.num_gpus)
    device = torch.device("cuda" if use_cuda else "cpu")
    
    torch.manual_seed(args.seed)
    if use_cuda:
        torch.cuda.manual_seed(args.seed)
    
    df = pd.read_csv(os.path.join(args.data_dir, "train.csv"))
    print(df.shape)
    df_train, df_test = train_test_split(df, test_size=0.1, random_state=RANDOM_SEED)
   
    #df_test = pd.read_csv(os.path.join(args.data_dir, "test.csv")) - why not loading, different dir?
    
    df_val, df_test = train_test_split(df_test, test_size=0.5, random_state=RANDOM_SEED)

    train_data_loader = create_data_loader(df_train, tokenizer, MAX_LEN, args.batch_size)
    val_data_loader = create_data_loader(df_val, tokenizer, MAX_LEN, args.test_batch_size)
    test_data_loader = create_data_loader(df_test, tokenizer, MAX_LEN, args.test_batch_size)

    data = next(iter(train_data_loader))

    model = EulaClassifier(len(CLASS_NAMES))
    model = model.to(device)

    optimizer = AdamW(model.parameters(), lr=2e-5, correct_bias=False)
    total_steps = len(train_data_loader) * args.epochs

    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=0,
        num_training_steps=total_steps
    )

    loss_fn = nn.CrossEntropyLoss().to(device)
    history = defaultdict(list)
    best_accuracy = 0

    for epoch in range(args.epochs):

        print(f'Epoch {epoch + 1}/{args.epochs}')
        print('-' * 10)

        train_acc, train_loss = train_epoch(
            model,
            train_data_loader,
            loss_fn,
            optimizer,
            device,
            scheduler,
            len(df_train)
        )

        print(f'Train loss {train_loss} accuracy {train_acc}')

        val_acc, val_loss = eval_model(
            model,
            val_data_loader,
            loss_fn,
            device,
            len(df_val)
        )

        print(f'Val   loss {val_loss} accuracy {val_acc}')
        print()

        history['train_acc'].append(train_acc)
        history['train_loss'].append(train_loss)
        history['val_acc'].append(val_acc)
        history['val_loss'].append(val_loss)

        if val_acc > best_accuracy:
            torch.save(model.state_dict(), args.model_dir + '/best_model_state.bin')
            #model.save_pretrained("./model")
            best_accuracy = val_acc

    test_acc, _ = eval_model(
        model,
        test_data_loader,
        loss_fn,
        device,
        len(df_test)
    )

    print('\nTest Accuracy:\n')
    print(test_acc.item())

    y_review_texts, y_pred, y_pred_probs, y_test = get_predictions(
        model,
        test_data_loader
    )

    print(classification_report(y_test, y_pred, target_names=CLASS_NAMES))
    
    predictions_0 = [p[0].item() for p in y_pred_probs ]
    y = [y.item() for y in y_test]
    avg_brier = brier_score_loss(y, predictions_0, pos_label=0)
    print('P(class=0): Brier Score=%.4f' % (avg_brier))

    predictions_1 = [p[1].item() for p in y_pred_probs ]
    avg_brier = brier_score_loss(y, predictions_1, pos_label=1)
    print('P(class=1): Brier Score=%.4f' % (avg_brier))


    
def model_fn(model_dir):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    tokenizer = BertTokenizer.from_pretrained(PRE_TRAINED_MODEL_NAME)
    model = EulaClassifier(len(CLASS_NAMES))
    model.load_state_dict(torch.load(model_dir + '/best_model_state.bin', map_location=torch.device(device)))
    return model.to(device)    


def input_fn(request_body, request_content_type):
    """An input_fn that loads a pickled tensor"""
    print('input_fn')
    print(request_body)
    print(request_content_type)
    if request_content_type == "application/json":
        data = json.loads(request_body)
        sentence = data['text']
        if sentence is None:
            sentence = data

        encoded_text = tokenizer.encode_plus(
            sentence,
            add_special_tokens=True,
            truncation=True,
            max_length=MAX_LEN,
            return_token_type_ids=False,
            pad_to_max_length=True,
            return_attention_mask=True,
            return_tensors='pt',
        )

        input_ids = encoded_text["input_ids"].to(device)
        attention_mask = encoded_text["attention_mask"].to(device)

        return input_ids, attention_mask

    raise ValueError("Unsupported content type: {}".format(request_content_type))
    

def predict_fn(input_data, model):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()

    input_ids, attention_mask = input_data
    output = model(input_ids, attention_mask)
    _, prediction = torch.max(output, dim=1)
    probs = F.softmax(output, dim=1)
    print(prediction[0])
    print(probs)
    pred = int(prediction)
    print(pred)
    
    return {'prediction': pred, 'acc_prob': round((float(probs[0][0]) * 100), 2), 'unacc_prob': round((float(probs[0][1]) * 100), 2)}
    

if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    # Data and model checkpoints directories
    parser.add_argument(
        "--num_labels", type=int, default=2, metavar="N", help="input batch size for training (default: 64)"
    )

    parser.add_argument(
        "--batch-size", type=int, default=64, metavar="N", help="input batch size for training (default: 64)"
    )
    parser.add_argument(
        "--test-batch-size", type=int, default=1000, metavar="N", help="input batch size for testing (default: 1000)"
    )
    parser.add_argument("--epochs", type=int, default=2, metavar="N", help="number of epochs to train (default: 10)")
    parser.add_argument("--lr", type=float, default=0.01, metavar="LR", help="learning rate (default: 0.01)")
    parser.add_argument("--momentum", type=float, default=0.5, metavar="M", help="SGD momentum (default: 0.5)")
    parser.add_argument("--seed", type=int, default=42, metavar="S", help="random seed (default: 1)")
    parser.add_argument(
        "--log-interval",
        type=int,
        default=50,
        metavar="N",
        help="how many batches to wait before logging training status",
    )
    parser.add_argument(
        "--backend",
        type=str,
        default=None,
        help="backend for distributed training (tcp, gloo on cpu and gloo, nccl on gpu)",
    )
    
    # Container environment
    parser.add_argument("--hosts", type=list, default=json.loads(os.environ["SM_HOSTS"]))
    parser.add_argument("--current-host", type=str, default=os.environ["SM_CURRENT_HOST"])
    parser.add_argument("--model-dir", type=str, default=os.environ["SM_MODEL_DIR"])
    parser.add_argument("--data-dir", type=str, default=os.environ["SM_CHANNEL_TRAINING"])
    parser.add_argument("--test", type=str, default=os.environ["SM_CHANNEL_TESTING"])
    parser.add_argument("--num-gpus", type=int, default=os.environ["SM_NUM_GPUS"])

    train(parser.parse_args())