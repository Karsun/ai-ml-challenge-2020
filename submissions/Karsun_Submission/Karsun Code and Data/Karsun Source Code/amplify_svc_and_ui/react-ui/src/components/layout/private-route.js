import React, {Component, useEffect, useState} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {currentAuthenticatedUser} from "../../services/amplify-service";
import { useLocation } from 'react-router-dom'

const PrivateRoute = ({ component:Component, ...rest }) => {

    const location = useLocation();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const currentUser = await currentAuthenticatedUser();
            setCurrentUser(currentUser);
            setIsLoggedIn(currentUser && currentUser !== null);
            setIsLoaded(true);
        }
        checkAuth();
    }, []);

    if(!isLoaded) {
        return null;
    }

    if(isLoaded && !isLoggedIn) {
        return (
            <Redirect to={{ pathname: "/login" }}></Redirect>
        );
    }

    return (
        <Route
            {...rest}
            render={ props => {
                return (
                    <Component {...props} currentUser={currentUser}></Component>
                );
            }}
        />
    );
}

export default PrivateRoute;