import React from 'react';
import QrReader from "react-qr-scanner";
import {Button} from "@mui/material";
import PropTypes from "prop-types";

const VerifyQrCode = (props) => {
	const {assetCode, cameraId, onScanSuccess, onScanError, onClickFlipCamera, onClickManualMode} = props;
	return (
		<>
			<div className="div-center">
				<h3>Mã tài sản: {assetCode}</h3>
			</div>
			<div onClick={onClickFlipCamera}>
				<QrReader
					delay={0}
					style={{height: '100%', width: '100%'}}
					onError={onScanError}
					onScan={onScanSuccess}
					constraints={cameraId && ({ audio: false, video: { deviceId: cameraId } })}
				/>
			</div>
			<div className="div-center">
				<Button id="btn-default" variant="contained" onClick={onClickManualMode}>Nhập tay</Button>
			</div>
		</>
	);
}

VerifyQrCode.propTypes = {
	assetCode: PropTypes.string,
	cameraId: PropTypes.string,
	onScanSuccess: PropTypes.func,
	onScanError: PropTypes.func,
	onClickFlipCamera: PropTypes.func,
	onClickManualMode: PropTypes.func
};

export default VerifyQrCode;