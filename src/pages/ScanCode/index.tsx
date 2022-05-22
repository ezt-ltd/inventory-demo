import React, {useEffect, useState} from 'react';
import './main.style.css';
import QrScanner from "../../components/QrScanner";
import CustomDialog from "../../components/common/CustomDialog";
import {Fab, TextField} from "@mui/material";
import {useNotify} from "../../custom-hooks/useNotify";
import {Replay, Clear, Camera, FlipCameraAndroid} from '@mui/icons-material';

const ScanCode = (props: any) => {

    const {onLoading} = props;
    const notify = useNotify();

    const MIN_FAB = 2, MAX_FAB = 3;

    const [visibleDialog, setVisibleDialog] = useState(false);
    const [enableCamera, setEnableCamera] = useState(false);
    const [numOfFab, setNumOfFab] = useState(2); // default 2 floating action button (as Fab)
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
                console.log('[ScanCode] camera infos:', {cameraId: devices[0].deviceId, devices, loading: false});
            })
            .catch((error) => {
                console.log(error);
                onLoading(false);
            });
    }

    const handleTurnOnOffCamera = (onOff: boolean = false) => {
        if (onOff) {
            console.log(`[ScanCode] camera is turn on, number of fab is increase`);
            setNumOfFab(numOfFab >= MAX_FAB ? numOfFab : numOfFab + 1);
        } else {
            console.log(`[ScanCode] camera is turn off, number of fab is decrease`);
            setNumOfFab(numOfFab <= MIN_FAB ? numOfFab : numOfFab - 1);
        }
        setEnableCamera(onOff);
    }

    const handleSearching = () => {
        console.log('[ScanCode] on call searching');
        handleTurnOnOffCamera(true);
        setVisibleDialog(false);
    }

    const handleVerifyAudit = (verifyCode: string = '') => {
        const verifyResult = verifier(assetCode, verifyCode);
        console.log('[ScanCode] verify result:', {assetCode, verifyCode, verifyResult});
        if (verifyResult) {
            notify.showNotify('MATCHED', 'success');
        } else {
            notify.showNotify('NOT MATCH', 'error');
        }
    }

    const handleCloseDialog = () => {
        notify.showNotify('Test', 'success');
        console.log('[ScanCode] close dialog was denied')
    }

    const handleRetry = () => {
        console.log('[ScanCode] user action to retry');
        setAssetCode('');
        handleTurnOnOffCamera(false);
    }

    const handleStartScan = () => {
        console.log('[ScanCode] camera is enabled');
        handleTurnOnOffCamera(true);
    }

    const handleStopScan = () => {
        console.log('[ScanCode] camera is disabled');
        handleTurnOnOffCamera(false);
    }

    const handleFlipCamera = () => {
        if (listCamera.length === 0 || !cameraId) {
            console.log('[ScanCode] Camera permission is required!');
            return;
        }
        console.log('[ScanCode] handleFlipCamera -> list camera and current selected', {listCamera, cameraId});
        const toggleCamera = listCamera.filter(item => item.deviceId !== cameraId);
        console.log('[ScanCode] handleFlipCamera -> select new camera', {
            cameraId,
            newCamera: toggleCamera[0].deviceId
        });
        setCameraId(toggleCamera[0].deviceId);
    }

    const onChangeCode = (event: any) => {
        console.log('[ScanCode] onChangeCode value:', event.target.value);
        setAssetCode(event.target.value);
    }

    const verifier = (source = '', value = '') => {
        console.log('[ScanCode] searching:', {source, value});
        const verifyKey = source.replace(/#/g, '');
        const testCase = new RegExp(`(${verifyKey})`, 'i');
        console.log('[ScanCode] verify value:', {
            result: testCase.test(value), algorithm: `(${verifyKey})`
        });
        return testCase.test(value);
    }

    const onScanSuccess = (data: any) => {
        if (!data) {
            return;
        }
        handleTurnOnOffCamera(false);
        const qrResult = data.text;
        console.log('[ScanCode] onScanSuccess result:', {qrResult, data});
        handleVerifyAudit(qrResult);
    }

    const onScanError = (error: any) => {
        if (error) {
            console.log('[ScanCode] onScanError error:', {error});
        }
    }

    useEffect(() => {
        cameraProcessing().finally(() => {
            console.log('[ScanCode] camera initialed!');
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!assetCode) {
            console.log('[ScanCode] assetCode not found!');
            setVisibleDialog(true);
        }
    }, [assetCode]);

    return (
        <>
            <div className="floating-wrapper" style={{marginTop: `calc(100vh - ${(66 * numOfFab) + 60}px)`}}>
                {
                    enableCamera && <div className="floating-button">
		                <Fab aria-label="flip-camera" color="default" onClick={handleFlipCamera}>
			                <FlipCameraAndroid/>
		                </Fab>
	                </div>
                }
                <div className="floating-button">
                    <Fab aria-label="retry" color="primary" onClick={handleRetry}>
                        <Replay/>
                    </Fab>
                </div>
                <div className="floating-button">
                    {
                        enableCamera ? <Fab aria-label="stop" color="error" onClick={handleStopScan}>
                            <Clear/>
                        </Fab> : <Fab aria-label="start" color="warning" onClick={handleStartScan}>
                            <Camera/>
                        </Fab>
                    }
                </div>
            </div>

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

            <QrScanner
                cameraId={cameraId} cameraStatus={enableCamera} onClickFlipCamera={handleFlipCamera}
                onScanSuccess={onScanSuccess} onScanError={onScanError}
            />
        </>
    );
}

export default ScanCode;