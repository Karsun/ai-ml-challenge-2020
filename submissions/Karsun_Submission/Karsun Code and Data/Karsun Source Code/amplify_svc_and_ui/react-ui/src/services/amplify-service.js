import Amplify, { Auth, Storage, API } from 'aws-amplify';
import config from './amplify.config';
import axios from 'axios';

Amplify.configure(config);

export const signIn = async (userName, pwd) => {
    try {
        const resp = await Auth.signIn(userName, pwd);
        console.log('signin', resp);
        return resp;
    } catch (e) {
        console.log('error login', e);
        throw e;
    }
}

export const signUp = async (userName, pwd, email) => {
    try {
        const resp = Auth.signUp({
            username: userName, password: pwd, attributes: { email }
        });
        console.log('signup', resp);
        return resp;
    } catch (e) {
        console.log('error signUp', e);
        throw e;
    }
}

export const confirmSignUp = async (userName, code) => {
    try {
        const resp = Auth.confirmSignUp(userName, code);
        console.log('confirmSignUp', resp);
        return resp;
    } catch (e) {
        console.log('error confirmSignUp', e);
        throw e;
    }
}

export const currentAuthenticatedUser = async() => {
    try {
        const loggedInUser = await Auth.currentAuthenticatedUser();
        return formUserObject(loggedInUser);
    } catch(e) {
        console.log('Error on get current user (currentAuthenticatedUser) ', e);
        return undefined;
    }
};

const formUserObject = (authResp) => {
    console.log('authResp', authResp);
    const { payload } = authResp.signInUserSession.idToken;
    let user = {
        id: payload['cognito:username'],
        userName: payload['cognito:username'],
        email: payload['email'],
        email_verified: payload['email_verified'],
    };
    return user;
}

export const logout = () => {
    try {
        Auth.signOut();
    } catch (e) {
        console.log('Error signout', e);
    }
};

export const getToken = async () => {
    let sessionToken = await Auth.currentSession();
    return sessionToken.idToken.jwtToken;
};

export const uploadFileToS3 = async (filename, type, file ) => {
    const resp = await Storage.put(filename, file, {
        contentType: type
    })

    console.log('S3 Object ', resp);
    return resp;
}

export const getFileFromS3 = async (filename) => {
    const resp = await Storage.get(filename)

    console.log('S3 Object ', resp);
    return resp;
}

export const invokeEulaClassification = async (filename) => {
    const options = {
        body: {
            filename: filename
        },
    };
    console.log('options', options);
    const resp = await API.post("jeulacl", '/classificationreqs', options);
    console.log('resp', resp);
    return resp;
}