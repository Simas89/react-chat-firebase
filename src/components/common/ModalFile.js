import React from 'react';
import {
	Paper,
	Typography,
	Button,
	Dialog,
	Box,
	CircularProgress,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

export const ModalFile = ({ setIsFileModalOpen, uploadFile }) => {
	const [file, setFile] = React.useState('');
	const [loading, setLoading] = React.useState(false);

	const handleClose = () => {
		setIsFileModalOpen(false);
	};

	const submitHandler = (e) => {
		e.preventDefault();
		setLoading(true);
		uploadFile(file);
	};

	return (
		<Dialog aria-labelledby="customized-dialog-title" open>
			<Paper
				style={{
					backgroundColor: 'white',
					width: '500px',
					padding: '16px',
				}}
			>
				<Typography variant="h6">Upload an Image</Typography>

				<form onSubmit={submitHandler}>
					<Box display="flex" flexDirection="column" justify="flex-end">
						<Box height="18px" />
						<Box display="flex" alignItems="center">
							<input
								style={{ display: 'none' }}
								accept="image/*"
								id="contained-button-file"
								multiple
								type="file"
								hidden
								onChange={(e) => setFile(e.target.files[0])}
							/>
							<label htmlFor="contained-button-file">
								<Button variant="outlined" component="span">
									select image
								</Button>
							</label>
							<Typography noWrap style={{ marginLeft: '10px' }}>
								{file.name}
							</Typography>
						</Box>
						<Box height="18px" />
						<Box display="flex" justifyContent="space-between">
							<Button
								type="submit"
								autoFocus
								variant="contained"
								color="primary"
								endIcon={<CloudUploadIcon />}
								disabled={!Boolean(file) || loading}
							>
								Upload
								{loading && (
									<CircularProgress
										size={30}
										style={{ position: 'absolute' }}
									/>
								)}
							</Button>
							<Button autoFocus onClick={handleClose} color="primary">
								Cancel
							</Button>
						</Box>
					</Box>
				</form>
			</Paper>
		</Dialog>
	);
};
