import React from 'react';
import {
	Paper,
	Typography,
	Button,
	Dialog,
	Box,
	TextField,
} from '@material-ui/core';

import AttachFileIcon from '@material-ui/icons/AttachFile';

export const ModalFile = ({
	setIsFileModalOpen,
	file,
	setFile,
	fileCaption,
	setFileCaption,
}) => {
	const handleClose = () => {
		setIsFileModalOpen(false);
	};

	const handleClear = () => {
		setFile('');
		setFileCaption('');
		setIsFileModalOpen(false);
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

				<form onSubmit={handleClose}>
					<Box display="flex" flexDirection="column" justify="flex-end">
						<Box height="18px" />
						<Box
							display="flex"
							flexDirection="column"
							alignItems="flex-start"
						>
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
							<TextField
								onChange={(e) => setFileCaption(e.target.value)}
								value={fileCaption}
								style={{ width: '100%' }}
								variant="outlined"
								type="text"
								label="Image caption"
								id="image-caption"
								margin="dense"
								size="small"
							/>
						</Box>

						<Box height="18px" />
						<Box display="flex" justifyContent="space-between">
							<Button
								type="submit"
								autoFocus
								variant="contained"
								color="primary"
								endIcon={<AttachFileIcon />}
								disabled={!Boolean(file)}
							>
								Attach
							</Button>
							<Button autoFocus onClick={handleClear} color="primary">
								Cancel
							</Button>
						</Box>
					</Box>
				</form>
			</Paper>
		</Dialog>
	);
};
