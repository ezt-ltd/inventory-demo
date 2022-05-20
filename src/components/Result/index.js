import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Button} from "@mui/material";

const Result = (props) => {
	const {result, onClickReset, onClickRetry} = props;
	return (
		<>
			<div className="div-center">
				{
					result === 'MATCHED' ?
						<Alert severity="success">{result}</Alert> :
						<Alert severity="error">{result}</Alert>
				}
			</div>
			<div className="div-center">
				<Button id="btn-default" variant="contained" onClick={onClickReset}>Mã khác</Button>
				<Button variant="contained" onClick={onClickRetry}>Tìm lại</Button>
			</div>
		</>
	);
}

Result.propTypes = {
	result: PropTypes.string,
	onClickReset: PropTypes.func,
	onClickRetry: PropTypes.func,
};

export default Result;