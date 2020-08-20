import React, {useEffect, useState} from 'react';
import {confirmSignUp, currentAuthenticatedUser, signIn, signUp} from "../services/amplify-service";
import {useLocation, useHistory} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Backdrop from "@material-ui/core/Backdrop";
import {Grid} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        maxWidth: 400,
    },
    media: {
        height: 600,
        width: 600
    },
});

const ConfirmSignUpPage = () => {

    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [isInputError, setIsInputError] = useState(false);
    const [userName, setUserName] = useState('');
    const [code, setCode] = useState('');

    const submit = async () => {
        setIsInputError(false);
        if(!userName || userName.length <= 0) {
            setIsInputError(true);
        }

        if(!isInputError) {
            try {
                setLoading(true);
                await confirmSignUp(userName, code);
                setLoading(false);
                history.replace('/login');
            } catch(e) {

            }

        }

    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '80vh' }}
        >
            <Grid item xs={3}>
                <Card className={classes.root} variant="outlined">
                    <CardContent>
                        <form className={classes.root} noValidate autoComplete="off" onSubmit={e => e.preventDefault()}>

                            <Grid container spacing={1} style={{width: '100%'}}>
                                <Grid item xs={12}>
                                    <Typography className={classes.title} color="textPrimary" gutterBottom variant={"h6"}>
                                        Confirm Sign up
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        style={{width: '90%'}}
                                        error={isInputError}
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        required
                                        id="username-login"
                                        label="User Name"
                                        defaultValue=""
                                        helperText="Username is required."/>

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        style={{width: '90%'}}
                                        value={code}
                                        required
                                        onChange={(e) => setCode(e.target.value)}
                                        error={isInputError}
                                        id="pwd-login"
                                        label="Code"
                                        autoComplete="current-password"
                                        helperText="Auth code received in your email." />
                                </Grid>

                            </Grid>

                        </form>

                    </CardContent>

                    <CardActions>
                        <Button size="small" variant="contained" color="primary" onClick={submit}>Submit</Button>
                    </CardActions>

                    <Backdrop open={loading} color="inherit" style={{zIndex: 1000, color: '#fff',}}>
                        <CircularProgress  />
                    </Backdrop>

                </Card>
            </Grid>
        </Grid>
    );
}

export default ConfirmSignUpPage;