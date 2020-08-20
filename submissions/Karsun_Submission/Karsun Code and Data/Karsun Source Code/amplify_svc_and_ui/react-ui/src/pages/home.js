import React, {useEffect, useState} from 'react';
import Header from "../components/layout/header";
import {Grid, CircularProgress, Typography, Paper} from "@material-ui/core";
import FileUploader from "../components/file/file-uploader";
import ParsedContentViewer from "../components/file/parsed_content";
import {
    currentAuthenticatedUser,
    getFileFromS3,
    invokeEulaClassification,
    uploadFileToS3
} from "../services/amplify-service";
import {mockedDataForPredictions} from "../services/mock-services"

const HomePage = () => {

    const [currentUser, setCurrentUser] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [currentEvaluations, setCurrentEvaluations] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [fileLoading, setFileLoading] = useState(false);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const checkUser = async () => {
            const c = await currentAuthenticatedUser();
            setCurrentUser(c);
        }
        checkUser();
    }, []);

    const onFileUpload = async (event) => {
        const { target: { value, files } } = event;
        const file = files[0];
        const name = (new Date()).getTime() + file.name;
        const type = file.type;

        setCurrentEvaluations([]);
        setFileLoading(true);
        setProcessing(true);
        setCounter(20);

        try {
            const resp = await uploadFileToS3(name, type, file);
            const s3File = await getFileFromS3(name);
            let url = s3File;
            if(!name.endsWith('pdf')) {
                url = "https://docs.google.com/gview?embedded=true&url=" + s3File;
            }
            console.log('url', url);
            setCurrentFile({name, type, file, url: url});
            setFileLoading(false);

            const classification = await invokeEulaClassification(name);
            setProcessing(false);
        } catch(e) {
            console.log(e);
        }

    }

    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    useEffect(() => {
       if(counter === 0 && processing) {
           setProcessing(false);
           setCurrentEvaluations(mockedDataForPredictions);
       }
    }, [counter]);

    return (
        <Grid container spacing={1} style={{maxHeight: '100vh'}}>
            <Grid item md={12}>
                {currentUser && <Header name={currentUser.userName}></Header>}
            </Grid>
            <Grid item md={12}>
                <FileUploader onFileUpload={onFileUpload}></FileUploader>
            </Grid>
            <Grid item lg={5} md={12}>

                {currentFile && currentFile.type.endsWith('pdf') && (
                    <iframe style={{overflow:'hidden',width:"100%",height:"90vh",position:"relative"}} src={currentFile.url}></iframe>
                )}

                {fileLoading && (
                    <div style={{paddingTop: '6em', paddingLeft: '2em', maxWidth: '400px'}}>
                        <Paper elevation={2} style={{padding: '1em'}}>
                            <CircularProgress />
                            <Typography variant="subtitle1">
                                The file is being securely moved to S3.
                            </Typography>
                        </Paper>
                    </div>

                )}

                {currentFile && !currentFile.type.endsWith('pdf') && (
                    <div style={{paddingTop: '6em', paddingLeft: '2em', maxWidth: '400px'}}>
                        <Paper elevation={2} style={{padding: '1em'}}>
                            <Typography variant="subtitle1">
                                Preview not available
                            </Typography>
                        </Paper>
                    </div>
                )}

            </Grid>
            <Grid item lg={7} md={12}>

                {processing && (
                    <div style={{paddingTop: '6em', paddingLeft: '2em', maxWidth: '500px'}}>
                        <Paper elevation={2} style={{padding: '1em'}}>
                            <CircularProgress />
                            <Typography variant="subtitle1">
                                This action triggered a Lambda serverless function, which will read the file from S3, extract text and invoke SageMaker endpoint to
                                run classification. Right now the whole process is not optimized to complete in 30 seconds which is the max time API Gateway can wait.
                                Even though the analysis is going on this action will fail due to timeout. Showing mocked data. {counter}
                            </Typography>
                        </Paper>
                    </div>
                )}

                {!processing && currentEvaluations.length > 0 && (
                    <ParsedContentViewer currentEvals={currentEvaluations}></ParsedContentViewer>
                )}


            </Grid>
        </Grid>
    );
}

export default HomePage