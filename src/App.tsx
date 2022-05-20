import React, {useEffect, useState} from 'react';
import './App.css';
import {LinearProgress} from "@mui/material";
import {injectDebugger} from "./utils/utils";
import * as queryString from "query-string";
import ScanQrByCode from "./pages/ScanQrByCode";

const App = () => {

    const [loading, setLoading] = useState(false);

    const initial = async () => {
        await injectDebugger();
    }

    const handleLoading = (event: boolean) => {
        console.log('[InventoryApp] loading:', event);
        setLoading(event);
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
            {loading && <LinearProgress/>}
            <ScanQrByCode loading={loading} onLoading={handleLoading}/>
        </>
    );
}

export default App;
