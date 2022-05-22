import React, {useEffect, useState} from 'react';
import './qr-scanner.style.css';
import QrReader from "react-qr-scanner";
import PropTypes from "prop-types";

const screen = window.screen;

const VerifyQrCode = (props) => {

	const {cameraId, cameraStatus, onScanSuccess, onScanError, onClickFlipCamera} = props;
	const [cameraConfig, setCameraConfig] = useState({audio: false, video: false});

	const handleFlipCamera = (event) => {
		if (!onClickFlipCamera || !cameraStatus) return;
		onClickFlipCamera(event);
	}

	useEffect(() => {
		if (cameraId) {
			console.log('[QrScanner] default camera:', cameraId);
			if (!cameraStatus) {
				const config = {audio: false, video: false};
				console.log('[QrScanner] disable camera:', config);
				setCameraConfig(config);
			} else {
				const config = {audio: false, video: {deviceId: cameraId}};
				console.log('[QrScanner] enable camera:', config);
				setCameraConfig(config);
			}
		} else {
			console.log('[QrScanner] camera not found');
		}
	}, [cameraId, cameraStatus]);

	return (
		<div id="camera-streaming" style={{width: screen.availWidth, height: screen.availHeight}} onClick={handleFlipCamera}>
			<QrReader
				delay={2000}
				style={{height: '100%', width: '100%'}}
				onError={onScanError}
				onScan={onScanSuccess}
				constraints={cameraConfig}
			/>
		</div>
	);
}

VerifyQrCode.propTypes = {
	cameraId: PropTypes.string,
	cameraStatus: PropTypes.bool,
	onClickFlipCamera: PropTypes.func,
	onScanSuccess: PropTypes.func,
	onScanError: PropTypes.func,
};

export default VerifyQrCode;