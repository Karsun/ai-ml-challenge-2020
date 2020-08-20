import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { ThemeProvider } from '@material-ui/styles';
import Container from "@material-ui/core/Container";
import LoginPage from "./pages/login";
import PrivateRoute from "./components/layout/private-route";
import HomePage from "./pages/home";
import LogoutPage from "./pages/logout";
import theme from "./components/layout/theme";
import ConfirmSignUpPage from "./pages/confirm";

function App() {
  return (
      <ThemeProvider theme={theme}>
        <Container maxWidth='xl' style={{backgroundColor: "#EEF4F5", height: '100vh'}}>
          <Router>
            <Switch>
              {/*<Redirect from="/" to="/auth" ></Redirect>*/}
              <Route exact={true} path="/">
                <LoginPage/>
              </Route>
              <Route exact={true} path="/login">
                <LoginPage/>
              </Route>
              <Route exact={true} path="/confirm">
                <ConfirmSignUpPage/>
              </Route>
              <PrivateRoute exact={true} path="/home">
                <HomePage/>
              </PrivateRoute>
              <Route exact={true} path="/logout">
                <LogoutPage/>
              </Route>
            </Switch>
          </Router>
        </Container>
      </ThemeProvider>
  );
}

export default App;
