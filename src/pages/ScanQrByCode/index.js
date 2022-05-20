import React, {useState} from 'react';
import './main.style.css';
import VerifyQrCode from "../../components/VerifyQrCode";
import VerifyAssetCode from "../../components/VerifyAssetCode";
import Result from "../../components/Result";
import Search from "../../components/Search";

const ScanQrByCode = (props) => {

    const {loading, onLoading} = props;
    const [mode, setMode] = useState('search');
    const [code, setCode] = useState('');

    const [listCamera, setListCamera] = useState([]);
    const [cameraId, setCameraId] = useState('');

    const [codeVerifier, setCodeVerifier] = useState('');

    const [result, setResult] = useState('MATCHED');

    const cameraProcessing = async () => {
        onLoading(true);
        await navigator.mediaDevices.enumerateDevices()
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
                setTimeout(() => {
                    onLoading(false);
                }, 2000);
                console.log({cameraId: devices[0].deviceId, devices, loading: false});
            })
            .catch((error) => {
                console.log(error);
                onLoading(false);
            });
    }

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
            handleSearching();
        });
    }

    const handleSearching = () => {
        cameraProcessing().finally(() => {
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
        setCodeVerifier('');
        setMode('verify-qr');
    }

    const onResetForm = () => {
        console.log('[ScanQrByCode] form reset')
        setCode('');
        setCodeVerifier('');
        setMode('search');
    }

    const onFlipCamera = () => {
        console.log('[ScanQrByCode] onFlipCamera -> list camera and current selected', {listCamera, cameraId});
        const toggleCamera = listCamera.filter(item => item.deviceId !== cameraId);
        console.log('[ScanQrByCode] onFlipCamera -> select new camera', {cameraId, newCamera: toggleCamera[0].deviceId});
        setCameraId(toggleCamera[0].deviceId);
    }

    return (
        <div className="center-page">
            {
                (mode === 'search') && <Search onChange={onChangeCode} onSubmit={onSubmitCode} onClickSearching={handleSearching} />
            }

            {
                (mode === 'verify-qr') && <VerifyQrCode
                    loading={loading} assetCode={code} cameraId={cameraId}
                    onScanSuccess={onScanSuccess} onScanError={onScanError}
                    onClickFlipCamera={onFlipCamera} onClickManualMode={() => setMode('verify-code')}
                />
            }

            {
                (mode === 'verify-code') && <VerifyAssetCode
                    assetCode={code} onChange={onChangeCodeVerifier} onVerify={onVerifyCodeManual}
                    onClickScanner={onTryScanner} onClickVerify={handleVerifyAudit}
                />
            }

            {
                (mode === 'result') && <Result result={result} onClickReset={onResetForm} onClickRetry={onTryScanner} />
            }
        </div>
    );
}

export default ScanQrByCode;