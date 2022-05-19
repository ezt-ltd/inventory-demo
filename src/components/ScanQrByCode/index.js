import React, {useEffect, useState} from 'react';
import './scan-qr-by-code.style.css';
import {Alert, Button, TextField} from "@mui/material";
// import { QrReader } from 'react-qr-reader'; // source: https://www.npmjs.com/package/react-qr-reader
import QrReader from 'react-qr-scanner'; // source: https://www.npmjs.com/package/react-qr-scanner

const ScanQrByCode = () => {

    const [mode, setMode] = useState('search');
    const [code, setCode] = useState('');

    const [listCamera, setListCamera] = useState([]);
    const [cameraId, setCameraId] = useState('');

    const [codeVerifier, setCodeVerifier] = useState('');

    const [result, setResult] = useState('MATCHED');

    const handlerEnterPress = (event, callback) => {
        if (event.keyCode === 13) {
            if (!callback || typeof callback != 'function') {
                console.log('[ScanQrByCode] Enter key pressed but callback not found');
                return;
            }
            callback(event.target.value);
        }
    }

    const onChangeCode = (event) => {
        console.log('[ScanQrByCode] onChangeCode value:', event.target.value);
        setCode(event.target.value);
    }

    const onSubmitCode = (event) => {
        handlerEnterPress(event, () => {
            console.log('[ScanQrByCode] onSubmitCode value:', event.target.value);
            setCode(event.target.value);
            setMode('verify-qr');
        });
    }

    const verifier = (source = '', value = '') => {
        console.log('[ScanQrByCode] searching:', {source, value});
        const verifyKey = source.replace(/#/g,'');
        const testCase = new RegExp(`(${verifyKey})`);
        console.log('[ScanQrByCode] verify value:', {
            result: testCase.test(value), algorithm: `(${verifyKey})`
        });
        return testCase.test(value);
    }

    const handleVerifyAudit = () => {
        console.log('[ScanQrByCode] verify result:', verifier(code, codeVerifier));
        setResult(verifier(code, codeVerifier) ? 'MATCHED' : 'NOT MATCH');
        setMode('result');
    }

    // const onScanQr = (result, error) => {
    //     if (!!result) {
    //         console.log('[ScanQrByCode] onScanQr result:', {result: result?.text});
    //         setCodeVerifier(result?.text)
    //     }
    //     //
    //     // if (!!error) {
    //     //     console.info(error);
    //     // }
    // }

    const onScanSuccess = async (data) => {
        if (!data) {
            return;
        }
        console.log('[ScanQrByCode] onScanSuccess result:', {result: data.text || ''});
        await setCodeVerifier(data.text);
        await handleVerifyAudit();
    }

    const onScanError = (error) => {
        // if (error) {
        //     console.log('[ScanQrByCode] onScanError result:', {error});
        //     setCodeVerifier('');
        // }
    }

    const onChangeCodeVerifier = (event) => {
        console.log('[ScanQrByCode] onChangeCodeVerifier value:', event.target.value);
        setCodeVerifier(event.target.value);
    }

    const onVerifyCodeManual = (event) => {
        handlerEnterPress(event, () => {
            console.log('[ScanQrByCode] onVerifyCodeManual value:', event.target.value);
            setCodeVerifier(event.target.value);
        });
    }

    const onTryScanner = () => {
        console.log('[ScanQrByCode] try scanner')
        setCode('');
        setMode('verify-qr');
    }

    const onResetForm = () => {
        console.log('[ScanQrByCode] form reset')
        setCode('');
        setMode('search');
    }

    const onFlipCamera = () => {
        console.log('[ScanQrByCode] onFlipCamera -> list camera and current selected', {listCamera, cameraId});
        const toggleCamera = listCamera.filter(item => item.deviceId !== cameraId);
        console.log('[ScanQrByCode] onFlipCamera -> select new camera', {cameraId, newCamera: toggleCamera[0].deviceId});
        setCameraId(toggleCamera[0].deviceId);
    }

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                const videoSelect = []
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
                console.log({cameraId: devices[0].deviceId, devices, loading: false});
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="center-page">
            {
                (mode === 'search') && <>
					<TextField
						fullWidth
						id="standard-basic"
						label="Mã trang bị"
						variant="standard"
						placeholder="Nhập mã trang bị"
                        onChange={onChangeCode}
						onKeyDown={onSubmitCode}
					/>
					<div className="div-center">
						<Button variant="contained" onClick={() => setMode('verify-qr')}>Tìm kiếm</Button>
					</div>
				</>
            }

            {
                (mode === 'verify-qr') && <>
                    <div className="div-center">
                        <h3>Mã tài sản: {code}</h3>
                    </div>
					<QrReader
                        delay={0}
                        style={{height: 240, width: '100%'}}
					    onError={onScanError}
                        onScan={onScanSuccess}
                        constraints={cameraId && ({ audio: false, video: { deviceId: cameraId } })}
                    />
					<div className="div-center">
						<Button variant="contained" onClick={onFlipCamera}>Xoay lại</Button>
						<Button id="btn-default" variant="contained" onClick={() => setMode('verify-code')}>Nhập tay</Button>
					</div>
				</>
            }

            {
                (mode === 'verify-code') && <>
		            <div className="div-center">
			            <h3>Mã tài sản: {code}</h3>
		            </div>
		            <TextField
			            fullWidth
			            id="standard-basic"
			            label="Mã tài sản"
			            variant="standard"
			            placeholder="Nhập mã tài sản"
                        onChange={onChangeCodeVerifier}
			            onKeyDown={onVerifyCodeManual}
		            />
			        <div className="div-center">
				        <Button variant="contained" onClick={onTryScanner}>Quét mã</Button>
				        <Button id="btn-default" variant="contained" onClick={handleVerifyAudit}>Xác thực</Button>
			        </div>
		        </>
            }

            {
                (mode === 'result') && <>
                    <div className="div-center">
                        {
                            result === 'MATCHED' ?
                                <Alert severity="success">{result}</Alert> :
                                <Alert severity="error">{result}</Alert>
                        }
                    </div>
					<div className="div-center">
						<Button id="btn-default" variant="contained" onClick={onResetForm}>Mã khác</Button>
                        <Button variant="contained" onClick={onTryScanner}>Tìm lại</Button>
                    </div>
				</>
            }
        </div>
    );
}

export default ScanQrByCode;