import React from 'react';
import PropTypes from 'prop-types';
import {Button, TextField} from "@mui/material";

const Search = (props) => {
	const {onChange, onSubmit, onClickSearching} = props;
	return (
		<>
			<TextField
				fullWidth
				id="standard-basic"
				label="Mã trang bị"
				variant="standard"
				placeholder="Nhập mã trang bị"
				onChange={onChange}
				onKeyDown={onSubmit}
			/>
			<div className="div-center">
				<Button variant="contained" onClick={onClickSearching}>Tìm kiếm</Button>
			</div>
		</>
	);
}

Search.propTypes = {
	onChange: PropTypes.func,
	onSubmit: PropTypes.func,
	onClickSearching: PropTypes.func
};

export default Search;