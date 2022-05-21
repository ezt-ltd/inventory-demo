import React, {useEffect, useState} from 'react';
import QrReader from "react-qr-scanner";
import PropTypes from "prop-types";

const VerifyQrCode = (props) => {

	const {cameraId, cameraStatus, onScanSuccess, onScanError, onClickFlipCamera} = props;
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
		<div id="camera-streaming" onClick={handleFlipCamera}>
			<QrReader
				delay={0}
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