# Explain how the user inferface works

The goal is to create an UI to accept EULA documents (word or pdf), parse it, and display the paragraphs of all the terms and conditions in the document. Please use Streamlit to paint the UI. The sample EULA documents are provided below.


### useful links

* [Streamlit - The fastest way to build data apps](https://www.streamlit.io/)
* [Introducing Streamlit, an app framework built for ML engineers](https://towardsdatascience.com/coding-ml-tools-like-you-code-ml-models-ddba3357eace)
* [Streamlit Docs - Get started](https://docs.streamlit.io/en/stable/getting_started.html)
* [Working with PDF and Word Documents](https://automatetheboringstuff.com/chapter13/)
* [Sample EULA documents](https://github.com/GSA/ai-ml-challenge-2020/tree/master/reference)


**Challenge UI App Instructions**
* Prerequisite: Python 3.8, Java 1.8 or above 
* Install prerequisites - pip3 install -r requirements.txt
* Install Torch and dependencies - pip3 install torch==1.6.0 torchvision==0.7.0 -f https://download.pytorch.org/whl/torch_stable.html
* Clone Repo and cd into User Interface Folder. 
* Run streamlit app. streamlit run challenge.py 
* App will be opened in the browser or else open a browser and type "http://localhost:8501/" as the website address
