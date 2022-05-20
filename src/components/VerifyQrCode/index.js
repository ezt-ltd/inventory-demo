import React from 'react';
import QrReader from "react-qr-scanner";
import {Button} from "@mui/material";
import PropTypes from "prop-types";

const VerifyQrCode = (props) => {
	const {loading, assetCode, cameraId, onScanSuccess, onScanError, onClickFlipCamera, onClickManualMode} = props;
	return (
		<>
			<div className="div-center">
				<h3>Mã tài sản: {assetCode}</h3>
			</div>
			{
				!loading && <QrReader
					delay={0}
					style={{height: '100%', width: '100%'}}
					onError={onScanError}
					onScan={onScanSuccess}
					constraints={cameraId && ({ audio: false, video: { deviceId: cameraId } })}
				/>
			}
			<div className="div-center">
				{!loading && <Button variant="contained" onClick={onClickFlipCamera}>Xoay lại</Button>}
				<Button id="btn-default" variant="contained" onClick={onClickManualMode}>Nhập tay</Button>
			</div>
		</>
	);
}

VerifyQrCode.propTypes = {
	loading: PropTypes.bool,
	assetCode: PropTypes.string,
	cameraId: PropTypes.string,
	onScanSuccess: PropTypes.func,
	onScanError: PropTypes.func,
	onClickFlipCamera: PropTypes.func,
	onClickManualMode: PropTypes.func
};

export default VerifyQrCode;