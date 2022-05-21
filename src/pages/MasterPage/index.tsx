import React, {useState} from 'react';
import './master.style.css';
import ScanQrByCode from "../ScanQrByCode";
// import {VariantType} from "notistack";
// import {useNotify} from "../../custom-hooks/useNotify";

const MasterPage = () => {
    const [loading, setLoading] = useState(false);
    // const notify = useNotify();

    // const handleOpenSnackBar = (message?: string, variant?: VariantType) => {
    //     console.log('[ScanQrByCode] SnackBar is opening');
    //     notify.showNotify(message, variant);
    // }

    const handleLoading = (event: boolean) => {
        console.log('[InventoryApp] loading:', event);
        setLoading(event);
    }

    return <ScanQrByCode loading={loading} onLoading={handleLoading}/>;
}

export default MasterPage;