import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_SNACK } from 'types/mainTypes';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const SnackBarCustom = () => {
	const snack = useSelector((state) => state.snack);
	const dispatch = useDispatch();

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		dispatch({
			type: SET_SNACK,
			payload: { open: false },
		});
	};

	return (
		<Snackbar
			anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
			open={snack.open}
			autoHideDuration={3000}
			onClose={handleClose}
		>
			<Alert onClose={handleClose} severity={snack.severity}>
				{snack.message}
			</Alert>
		</Snackbar>
	);
};
