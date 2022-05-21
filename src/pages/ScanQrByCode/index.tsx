import React, {useEffect, useState} from 'react';
import './main.style.css';
import VerifyQrCode from "../../components/VerifyQrCode";
import CustomDialog from "../../components/common/CustomDialog";
import {TextField} from "@mui/material";
import {useNotify} from "../../custom-hooks/useNotify";

const ScanQrByCode = (props: any) => {

    const {onLoading} = props;
    const notify = useNotify();

    const [visibleDialog, setVisibleDialog] = useState(false);
    const [enableCamera, setEnableCamera] = useState(false);
    const [assetCode, setAssetCode] = useState('');

    const [listCamera, setListCamera] = useState<Array<any>>([]);
    const [cameraId, setCameraId] = useState('');

    const cameraProcessing = async () => {
        onLoading(true);
        await navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                const videoSelect: Array<any> = []
                devices.forEach((device) => {
                    if (device.kind === 'videoinput') {
                        videoSelect.push(device)
                    }
                });
                setListCamera(videoSelect);
                return videoSelect;
            })
            .then((devices) => {
                setCameraId(devices[0].deviceId);
                setTimeout(() => {
                    onLoading(false);
                }, 2000);
                console.log('[ScanQrByCode] camera infos:', {cameraId: devices[0].deviceId, devices, loading: false});
            })
            .catch((error) => {
                console.log(error);
                onLoading(false);
            });
    }

    const handleSearching = () => {
        console.log('[ScanQrByCode] on call searching');
        setEnableCamera(true);
        setVisibleDialog(false);
    }

    const handleVerifyAudit = (verifyCode: string = '') => {
        const verifyResult = verifier(assetCode, verifyCode);
        console.log('[ScanQrByCode] verify result:', {assetCode, verifyCode, verifyResult});
        if (verifyResult) {
            notify.showNotify('MATCHED', 'success');
        } else {
            notify.showNotify('NOT MATCH', 'error');
        }
    }

    const handleCloseDialog = () => {
        console.log('[ScanQrByCode] close dialog was denied')
    }

    const onChangeCode = (event: any) => {
        console.log('[ScanQrByCode] onChangeCode value:', event.target.value);
        setAssetCode(event.target.value);
    }

    const verifier = (source = '', value = '') => {
        console.log('[ScanQrByCode] searching:', {source, value});
        const verifyKey = source.replace(/#/g, '');
        const testCase = new RegExp(`(${verifyKey})`, 'i');
        console.log('[ScanQrByCode] verify value:', {
            result: testCase.test(value), algorithm: `(${verifyKey})`
        });
        return testCase.test(value);
    }

    const onScanSuccess = (data: any) => {
        if (!data) {
            return;
        }
        const qrResult = data.text;
        console.log('[ScanQrByCode] onScanSuccess result:', {qrResult, data});
        handleVerifyAudit(qrResult);
    }

    const onScanError = (error: any) => {
        // if (error) {
        //     console.log('[ScanQrByCode] onScanError result:', {error});
        //     setCodeVerifier('');
        // }
    }

    const onFlipCamera = () => {
        if (listCamera.length === 0 || !cameraId) {
            console.log('[ScanQrByCode] Camera permission is required!');
            return;
        }
        console.log('[ScanQrByCode] onFlipCamera -> list camera and current selected', {listCamera, cameraId});
        const toggleCamera = listCamera.filter(item => item.deviceId !== cameraId);
        console.log('[ScanQrByCode] onFlipCamera -> select new camera', {
            cameraId,
            newCamera: toggleCamera[0].deviceId
        });
        setCameraId(toggleCamera[0].deviceId);
    }

    useEffect(() => {
        cameraProcessing().finally(() => {
            console.log('[ScanQrByCode] camera initialed!');
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!assetCode) {
            console.log('[ScanQrByCode] assetCode not found!');
            setVisibleDialog(true);
        }
    }, [assetCode]);

    return (
        <>
            <VerifyQrCode
                assetCode={assetCode} cameraId={cameraId} cameraStatus={enableCamera}
                onScanSuccess={onScanSuccess} onScanError={onScanError} onClickFlipCamera={onFlipCamera}
            />

            <CustomDialog
                visible={visibleDialog} onClose={handleCloseDialog}
                dialogInfo={{
                    title: 'Tìm kiếm',
                    buttons: [{label: 'Tìm kiếm', onClick: handleSearching}],
                    children: <TextField
                        fullWidth id="standard-basic" label="Mã trang bị" variant="standard"
                        placeholder="Nhập mã trang bị" onChange={onChangeCode}
                    />
                }}
            />
        </>
    );
}

export default ScanQrByCode;