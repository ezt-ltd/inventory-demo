import React, {useEffect} from 'react';
import './App.css';
import {injectDebugger} from "./utils/utils";
import * as queryString from "query-string";
import MasterPage from "./pages/MasterPage";

const App = () => {

    const initial = async () => {
        await injectDebugger();
    }

    useEffect(() => {
        const {debug} = queryString.parse(window.location.search);
        if (debug) {
            initial().finally(() => {
                console.log('[InventoryApp] debug via eruda');
            });
        }
    }, []);

    return <MasterPage />;
}

export default App;
