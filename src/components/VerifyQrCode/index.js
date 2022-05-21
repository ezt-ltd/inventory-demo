import React, {useEffect, useState} from 'react';
import QrReader from "react-qr-scanner";
import {Button} from "@mui/material";
import PropTypes from "prop-types";

const VerifyQrCode = (props) => {

	const {assetCode, cameraId, cameraStatus, onScanSuccess, onScanError, onClickFlipCamera, onClickManualMode} = props;
	const [cameraConfig, setCameraConfig] = useState({audio: false, video: false});

	const handleFlipCamera = (event) => {
		if (!onClickFlipCamera || !cameraStatus) return;
		onClickFlipCamera(event);
	}

	useEffect(() => {
		if (cameraId) {
			console.log('[VerifyQrCode] default camera:', cameraId);
			if (!cameraStatus) {
				const config = {audio: false, video: false};
				console.log('[VerifyQrCode] disable camera:', config);
				setCameraConfig(config);
			} else {
				const config = {audio: false, video: {deviceId: cameraId}};
				console.log('[VerifyQrCode] enable camera:', config);
				setCameraConfig(config);
			}
		} else {
			console.log('[VerifyQrCode] camera not found');
		}
	}, [cameraId, cameraStatus]);

	return (
		<>
			<div className="div-center fixed-top-bar">
				<h1>Inventory App</h1>
				{assetCode && <h3>Mã tài sản: {assetCode}</h3>}
			</div>
			<div id="camera-streaming" onClick={handleFlipCamera}>
				<QrReader
					delay={0}
					style={{height: '100%', width: '100%'}}
					onError={onScanError}
					onScan={onScanSuccess}
					constraints={cameraConfig}
				/>
			</div>
			<div className="div-center floating-button">
				<Button id="btn-default" variant="contained" onClick={onClickManualMode}>Nhập tay</Button>
			</div>
		</>
	);
}

VerifyQrCode.propTypes = {
	assetCode: PropTypes.string,
	cameraId: PropTypes.string,
	cameraStatus: PropTypes.bool,
	onScanSuccess: PropTypes.func,
	onScanError: PropTypes.func,
	onClickFlipCamera: PropTypes.func,
	onClickManualMode: PropTypes.func
};

export default VerifyQrCode;