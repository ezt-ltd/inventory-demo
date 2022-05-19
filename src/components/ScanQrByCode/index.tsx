import React, {useState} from 'react';
import './scan-qr-by-code.style.css';
import {Alert, Button, TextField} from "@mui/material";
import {QrReader} from 'react-qr-reader'; // source: https://www.npmjs.com/package/react-qr-reader

const ScanQrByCode = () => {

    const [code, setCode] = useState('');
    const [mode, setMode] = useState<'search' | 'verify-qr' | 'verify-code' | 'result'>('search');
    const [result, setResult] = useState('MATCHED');

    const handlerEnterPress = (event: any, callback: any) => {
        if (event.keyCode === 13) {
            if (!callback || typeof callback != 'function') {
                console.log('[ScanQrByCode] Enter key pressed but callback not found');
                return;
            }
            callback(event.target.value);
        }
    }

    const onSubmitCode = (event: any) => {
        handlerEnterPress(event, () => {
            console.log('[ScanQrByCode] value:', event.target.value);
            setCode(event.target.value);
            setMode('verify-qr');
        });
    }

    const search = (source: string = '', value: string = '') => {
        console.log('[ScanQrByCode] searching:', {source, value});
        const testCase = new RegExp(`([${source.replace(/#/g,'')}])\\w+`);
        console.log('[ScanQrByCode] verify value:', testCase.test(value))
        return testCase.test(value);
    }

    const handleVerifyAudit = (qrData: string = '') => {
        setResult(search(code, qrData) ? 'MATCHED' : 'NOT MATCH');
        setMode('result');
    }

    const onScanQr = (result: any, error: any) => {
        if (!!result) {
            console.log('[ScanQrByCode] result:', {result: result?.text});
            handleVerifyAudit(result?.text);
        }
        //
        // if (!!error) {
        //     console.info(error);
        // }
    }

    const onVerifyCodeManual = (event: any) => {
        handlerEnterPress(event, () => {
            handleVerifyAudit(event.target.value);
        });
    }

    const onResetForm = () => {
        setCode('');
        setMode('search');
    }

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
                        onChange={event => setCode(event.target.value)}
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
						onResult={onScanQr}
						scanDelay={0}
						constraints={{facingMode: 'user'}}
					/>
					<div className="div-center">
						<Button variant="contained" onClick={() => setMode('verify-code')}>Nhập tay</Button>
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
			            onKeyDown={onVerifyCodeManual}
		            />
			        <div className="div-center">
				        <Button variant="contained" onClick={() => setMode('verify-qr')}>Quét mã</Button>
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
						<Button variant="contained" onClick={() => setMode('verify-qr')}>Tìm lại</Button>
						<Button variant="contained" style={{marginLeft: '1em'}} onClick={onResetForm}>Tìm mã khác</Button>
					</div>
				</>
            }
        </div>
    );
}

export default ScanQrByCode;