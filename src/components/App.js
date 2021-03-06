import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
import "../css/main.css"
import "react-toastify/dist/ReactToastify.css";
import MainMenu from './MainMenu';
// import Game from './Game';
import { ToastContainer } from 'react-toastify';
import InstancesModals from './InstancesModal';
import SocketProvider from './socket_context/SocketProvider';
import Game from './Game';

function App() {
    return (
        <div className="container-fluid">
            <SocketProvider>
                <ToastContainer newestOnTop autoClose={2000} hideProgressBar />
                <Switch>
                    <Route path="/" exact component={MainMenu} />
                    <Route path="/game" exact component={Game} />
                    <Redirect from="/game" to="/" />
                    <Route path="/instances" exact component={InstancesModals} />
                </Switch>
            </SocketProvider>
        </div>
    );
}

export default App;
