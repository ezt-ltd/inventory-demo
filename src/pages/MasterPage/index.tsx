import React, {useState} from 'react';
import {LinearProgress, Snackbar} from "@mui/material";
import ScanQrByCode from "../ScanQrByCode";

const MasterPage = () => {
    const [loading, setLoading] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [notify, setNotify] = useState('MasterPage');

    const handleOpenSnackBar = () => {
        console.log('[ScanQrByCode] opening SnackBar');
        setOpenSnackBar(true);
    }

    const handleCloseSnackBar = () => {
        console.log('[ScanQrByCode] closing SnackBar');
        setOpenSnackBar(false);
    }

    const handleLoading = (event: boolean) => {
        console.log('[InventoryApp] loading:', event);
        setLoading(event);
    }

    return (
        <>
            {loading && <LinearProgress/>}

            <ScanQrByCode loading={loading} onLoading={handleLoading}/>

            <Snackbar
                key="top-center"
                open={openSnackBar}
                message={notify}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </>
    );
}

export default MasterPage;