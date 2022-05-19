import React, {useEffect} from 'react';
import './App.css';
import ScanQrByCode from "./components/ScanQrByCode";
import {LinearProgress} from "@mui/material";
import {injectDebugger} from "./utils/utils";
import * as queryString from "query-string";

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

    return (
        <>
            <LinearProgress/>
            <ScanQrByCode/>
        </>
    );
}

export default App;
