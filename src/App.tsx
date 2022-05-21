import React, {useEffect} from 'react';
import './App.css';
import {injectDebugger, isES6} from "./utils/utils";
import * as queryString from "query-string";
import MasterPage from "./pages/MasterPage";
import {SnackbarProvider} from "notistack";
import {Slide, SlideProps} from "@mui/material";

const TransitionUp = (props: SlideProps) => {
    return <Slide {...props} direction="up"/>;
}

const App = () => {

    const initial = async () => {
        await injectDebugger();
    }

    useEffect(() => {
        console.log(`Javascript running on ${isES6() ? 'ECMA6' : 'ECMA5'}`);
        const {debug} = queryString.parse(window.location.search);
        if (debug) {
            initial().finally(() => {
                console.log('[InventoryApp] debug via eruda');
            });
        }
    }, []);

    return (
        <SnackbarProvider
            maxSnack={3} autoHideDuration={3000} TransitionComponent={TransitionUp}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        >
            <MasterPage/>
        </SnackbarProvider>
    );
}

export default App;
