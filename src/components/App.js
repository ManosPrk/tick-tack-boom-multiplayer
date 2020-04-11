import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
import "../css/main.css"
import "react-toastify/dist/ReactToastify.css";
import MainMenu from './MainMenu';
import Game from './Game';
import { ToastContainer } from 'react-toastify';
import TextInput from './common/TextInput';
import { CookiesProvider } from 'react-cookie';

function App() {
    return (
        <div className="container-fluid">
            <CookiesProvider />
            <ToastContainer newestOnTop autoClose={2000} hideProgressBar />
            <Switch>
                <Route path="/" exact component={MainMenu} />
                <Route path="/game/:id" exact component={Game} />
                <Redirect from="/game" to="/" />
                <Route path="/inputs" exact component={TextInput} />
            </Switch>
        </div>
    );
}

export default App;
