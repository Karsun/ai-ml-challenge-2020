### Team Karsun 

#### 1. Validation Data File

[Here](./Karsun%20Validation%20Data%20File.csv) is the list of predictions we created using the deployed SageMaker endpoint.


#### 2. Description of methods

1. Overall approach

    This presentation [here](Karsun%20Description%20of%20Methods.pdf) talks about our overall approach.

2. Jupyter Notebook part 1

    This [Jupyter Notebook](Karsun%20Description%20of%20Methods%201.ipynb) walks 
    through our data analysis, model architecture and training job execution. 

3. Jupyter Notebook part 2

    This [Jupyter Notebook](Karsun%20Description%20of%20Methods%202.ipynb) has dependency 
    on SageMaker. This notebook uses the hyperparameters and model architecture arrived 
    at the previous step and delegates the training process to SageMaker. 
    SageMaker will create the final model. This notebook also deploys the created model 
    as a Sagemaker endpoint, against with predictions / inferences can be run.

#### Compiled Model

The final model which is generated in more than 300 MB, since we cannot use GitHub to share such a large artifact, we have made it available here:
https://sagemaker-us-east-1-695620255925.s3.amazonaws.com/pytorch-training-2020-08-20-06-47-04-737/model.tar.gz

#### User interface

We are submitting two solutions for user interface. 

1. Stand-alone UI solution

    One is a python app using Streamlit. The app can be started in any machine with Python. 
    Code and instructions to start it locally is available in the 
    [steamlit-ui folder](Karsun%20Code%20and%20Data/Karsun%20Source%20Code/streamlit-ui).

2. Serverless UI and Services

    Here is the URL to access this UI: https://eula.karsun-ai.com/ (No tracking or analytics enabled). 
    This is build with React.js and AWS Amplify (Cognito, S3, API Gateway, Lambda). 
    This web-app allows for registration. Email is mandatory for registration.
    
    You may use this test account to explore: test_user / W3lC0m3#tc
    
    Amplify backend code and React UI code are available in the [folder](Karsun%20Code%20and%20Data/Karsun%20Source%20Code/amplify_svc_and_ui).
    
    When a document gets uploaded, the UI sends the doc to S3 (authorized with cognito user pool) 
    and triggers an API which will load the doc in a Lambda function, extract text and 
    run the prediction task by invoking the deployed SageMaker endpoint. 
    Even though the UI triggers the job, the job wouldn't complete in 30 seconds which 
    is a hard set limit for API Gateway timeout. We couldn't optimize this step before submission. 
    So the UI shows mocked data. How can this be fixed without compromising on serverless nature of this solution? We can convert the Lambda to be 
    websocket endpoint, so that Lambda can respond to user with smaller chunks. API Gateway has large timeout period for
    websocket and this would lead to better user experience with faster response. Employing SageMaker Elastic inferences would
    allow for faster parallel predictions.
    
    



