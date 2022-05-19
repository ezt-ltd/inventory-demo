import React, {useState} from 'react';
import './scan-qr-by-code.style.css';
import {Alert, Button, TextField} from "@mui/material";
import {QrReader} from 'react-qr-reader'; // source: https://www.npmjs.com/package/react-qr-reader

const ScanQrByCode = () => {

    const [code, setCode] = useState('');
    const [mode, setMode] = useState<'search' | 'verify' | 'result'>('search');
    const [result, setResult] = useState('MATCHED');

    const onChangeValue = (event: any) => {
        if (event.keyCode === 13) {
            console.log('[ScanQrByCode] value:', event.target.value);
            setCode(event.target.value);
        }
    }

    const onScanQr = (result: any, error: any) => {
        if (!!result) {
            console.log('[ScanQrByCode] result:', {result: result?.text});
            const qrData = result?.text;
            if (qrData === code) {
                setResult('MATCHED');
            } else {
                setResult('NOT MATCH');
            }
            setMode('result');
        }
        //
        // if (!!error) {
        //     console.info(error);
        // }
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
						onKeyDown={onChangeValue}
					/>
                    <div className="div-center">
	                    <Button variant="contained" onClick={() => setMode('verify')}>Tìm kiếm</Button>
                    </div>
                </>
            }

            {
                (mode === 'verify') && <QrReader
					onResult={onScanQr}
					scanDelay={0}
					constraints={{facingMode: 'user'}}
				/>
            }

            {
                (mode === 'result') && <>
		            <div className="div-center">
                        {
                            result === 'MATCHED' ?
                                <Alert severity="success">{result}</Alert> :
                                <Alert severity="error">{result}</Alert>
                        }
			            <Button
                            variant="contained"
                            onClick={() => setMode('verify')}
                        >
                            Tìm lại
                        </Button>
			            <Button
                            variant="contained"
                            style={{marginLeft: '1em'}}
                            onClick={() => setMode('search')}
                        >
                            Tìm mã khác
                        </Button>
                    </div>
                </>
            }
        </div>
    );
}

export default ScanQrByCode;