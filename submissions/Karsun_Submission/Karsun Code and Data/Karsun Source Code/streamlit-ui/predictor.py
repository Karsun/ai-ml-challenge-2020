import os

import pandas as pd
import requests
import torch
import torch.nn.functional as torch_functional
from torch import nn
from transformers import BertConfig, BertModel, BertTokenizer

MAX_LEN = 200
BATCH_SIZE = 16
NO_OVERLAP_SIZE = 150
EPOCHS = 2
CLASS_NAMES = ['Acceptable', 'Unacceptable']
PRE_TRAINED_MODEL_NAME = 'bert-base-cased'
DOWNLOAD_PATH = 'model'
MODEL_FILE_NAME = 'best_model_state.bin'
MODEL_URL = 'https://sagemaker-us-east-1-695620255925.s3.amazonaws.com/sagemaker/pytorch-bert/best_model_state.bin'
tokenizer = None
model = None
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")


def chunk_text_overlapping(text1):
    # Function to chunk text
    full = []
    if len(text1.split()) // NO_OVERLAP_SIZE > 0:
        n = len(text1.split()) // NO_OVERLAP_SIZE
    else:
        n = 1
    for w in range(n):
        if w == 0:
            partial = text1.split()[:MAX_LEN]
            full.append(" ".join(partial))
        else:
            partial = text1.split()[w * NO_OVERLAP_SIZE:w * NO_OVERLAP_SIZE + MAX_LEN]
            full.append(" ".join(partial))
    return full


class EulaClassifier(nn.Module):
    def __init__(self, n_classes):
        super(EulaClassifier, self).__init__()
        configuration = BertConfig.from_pretrained(PRE_TRAINED_MODEL_NAME)
        self.bert = BertModel.from_pretrained(PRE_TRAINED_MODEL_NAME, config=configuration)
        self.drop = nn.Dropout(p=0.3)
        self.out = nn.Linear(self.bert.config.hidden_size, n_classes)

    def forward(self, input_ids, attention_mask):
        _, pooled_output = self.bert(
            input_ids=input_ids,
            attention_mask=attention_mask
        )
        output = self.drop(pooled_output)
        return self.out(output)


def predict(text):
    # Function which does the prediction using the model for the text passed
    global tokenizer, model
    chunks = chunk_text_overlapping(text)

    prediction_array = []

    for c in chunks:
        encoded_text = tokenizer.encode_plus(
            c,
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

        output = model(input_ids, attention_mask)
        _, prediction = torch.max(output, dim=1)
        probability_obj = torch_functional.softmax(output, dim=1)
        prediction_int = int(prediction)
        prediction_array.append(
            {'text': c, 'prediction': prediction_int,
             'acceptable_probability': round((float(probability_obj[0][0]) * 100), 2),
             'unacceptable_probability': round((float(probability_obj[0][1]) * 100), 2)})

    df = pd.DataFrame(prediction_array, columns=['text', 'prediction', 'acceptable_probability',
                                                 'unacceptable_probability'])
    df = df.append({'text': 'FINAL_PREDICTION', 'prediction': df['prediction'].max(),
                    'acceptable_probability': df['acceptable_probability'].mean(),
                    'unacceptable_probability': df['unacceptable_probability'].mean()}, ignore_index=True)
    return df


def main():
    # main function to download (if model is not available) and initialize the predictor program
    global tokenizer, model
    if not os.path.isdir(DOWNLOAD_PATH):
        print("Model Folder not available. Creating..")
        os.mkdir(DOWNLOAD_PATH)

    if not os.path.isfile(DOWNLOAD_PATH + "/" + MODEL_FILE_NAME):
        print("Model File not available. Downloading... Please wait..")
        r = requests.get(MODEL_URL, allow_redirects=True)
        f = open(DOWNLOAD_PATH + "/" + MODEL_FILE_NAME, "wb")
        f.write(r.content)
        f.close()

    tokenizer = BertTokenizer.from_pretrained(PRE_TRAINED_MODEL_NAME)
    model = EulaClassifier(len(CLASS_NAMES))
    model.load_state_dict(torch.load(DOWNLOAD_PATH + "/" + MODEL_FILE_NAME, map_location=torch.device('cpu')))
    model = model.to(device)


main()
