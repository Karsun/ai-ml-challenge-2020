import React, {useEffect, useState} from 'react';
import {currentAuthenticatedUser, signIn, signUp} from "../services/amplify-service";
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
import PublicHeader from "../components/layout/header-public";

const useStyles = makeStyles({
    root: {
        maxWidth: 400,
    },
    media: {
        height: 600,
        width: 600
    },
});

const ACTIONS = {
    LOGIN: 'Login',
    REGISTER: 'Register'
}

const LoginPage = () => {

    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [action, setAction] = useState(ACTIONS.LOGIN);
    const [isInputError, setIsInputError] = useState(false);
    const [userName, setUserName] = useState('');
    const [pwd, setPwd] = useState('');
    const [email, setEmail] = useState('');

    const submit = async () => {
        setIsInputError(false);
        if(!userName || userName.length <= 0) {
            setIsInputError(true);
        }
        if(!pwd || userName.length <= 0) {
            setIsInputError(true);
        }

        if(action === ACTIONS.REGISTER && (!email || email.length <= 0)) {
            setIsInputError(true);
        }

        if(!isInputError) {
            setLoading(true);
            if(action == ACTIONS.LOGIN) {
                try {
                    await signIn(userName, pwd);
                    setLoading(false);
                    history.replace('/home');
                } catch(e) {

                }

            } else {
                try {
                    await signUp(userName, pwd, email);
                    setLoading(false);
                    history.replace('/confirm');
                } catch(e) {

                }
            }
        }

    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <PublicHeader />
            </Grid>
            <Grid item xs={12}>
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
                                                {action}
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
                                                value={pwd}
                                                required
                                                onChange={(e) => setPwd(e.target.value)}
                                                error={isInputError}
                                                id="pwd-login"
                                                label="Password"
                                                type="password"
                                                autoComplete="current-password"
                                                helperText="Password is required." />
                                        </Grid>
                                        {action === ACTIONS.REGISTER &&
                                        <Grid item xs={12}>
                                            <TextField
                                                style={{width: '90%'}}
                                                value={email}
                                                required
                                                onChange={(e) => setEmail(e.target.value)}
                                                error={isInputError}
                                                id="email-login"
                                                label="Email"
                                                type="email"
                                                helperText="Email is required for registration."/>
                                        </Grid>
                                        }
                                    </Grid>

                                </form>

                            </CardContent>

                            <CardActions>
                                <Button size="small" variant="contained" color="primary" onClick={submit}>{action}</Button>
                                {action === ACTIONS.LOGIN && <Button size="small" onClick={() => setAction(ACTIONS.REGISTER)}>New User? Register</Button>}
                                {action === ACTIONS.REGISTER && <Button size="small" onClick={() => setAction(ACTIONS.LOGIN)}>Already Registered? Login</Button>}
                            </CardActions>

                            <Backdrop open={loading} color="inherit" style={{zIndex: 1000, color: '#fff',}}>
                                <CircularProgress  />
                            </Backdrop>

                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

    );
}

export default LoginPage;