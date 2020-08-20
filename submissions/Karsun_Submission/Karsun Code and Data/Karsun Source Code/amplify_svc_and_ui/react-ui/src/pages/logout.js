import React from 'react';
import {logout} from "../services/amplify-service";
import { useHistory } from "react-router-dom";

const LogoutPage = () => {

    let history = useHistory();
    logout();
    history.push('/login');

    return (
        <div>
            <h6>Logging out..</h6>
        </div>
    );
}

export default LogoutPage;