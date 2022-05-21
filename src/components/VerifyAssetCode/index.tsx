import React from 'react';
import {Button, TextField} from "@mui/material";
import PropTypes from "prop-types";

const VerifyAssetCode = (props: any) => {
	const {assetCode, onChange, onVerify, onClickScanner, onClickVerify} = props;
	return (
		<>
			<div className="div-center">
				<h3>Mã tài sản: {assetCode}</h3>
			</div>
			<TextField
				fullWidth
				id="standard-basic"
				label="Mã tài sản"
				variant="standard"
				placeholder="Nhập mã tài sản"
				onChange={onChange}
				onKeyDown={onVerify}
			/>
			<div className="div-center">
				<Button variant="contained" onClick={onClickScanner}>Quét mã</Button>
				<Button id="btn-default" variant="contained" onClick={onClickVerify}>Xác thực</Button>
			</div>
		</>
	);
}

VerifyAssetCode.propTypes = {
	assetCode: PropTypes.string,
	onChange: PropTypes.func,
	onVerify: PropTypes.func,
	onClickScanner: PropTypes.func,
	onClickVerify: PropTypes.func
};

export default VerifyAssetCode;