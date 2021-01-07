import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_SNACK } from 'types/mainTypes';
import {
	Paper,
	Typography,
	TextField,
	Button,
	Dialog,
	Box,
} from '@material-ui/core';

export const ModalChannels = ({ setOpen, channelsRef }) => {
	const dispatch = useDispatch();
	const [name, setName] = React.useState('');
	const [about, setAbout] = React.useState('');
	const currentUser = useSelector((state) => state.user.currentUser);

	const nameMax = 20;
	const aboutMax = 100;

	const handleClose = () => {
		setOpen(false);
	};

	const submitHandler = (e) => {
		e.preventDefault();

		const key = channelsRef.push().key;

		const newChannel = {
			id: key,
			name,
			details: about,
			createdBy: {
				name: currentUser.displayName,
				avataer: currentUser.photoURL,
			},
		};

		channelsRef
			.child(key)
			.update(newChannel)
			.then(() => {
				handleClose();
				dispatch({
					type: SET_SNACK,
					payload: {
						open: true,
						severity: 'success',
						message: 'Channel created!',
					},
				});
			})
			.catch((err) => {
				console.log(err);
				handleClose();
				dispatch({
					type: SET_SNACK,
					payload: {
						open: true,
						severity: 'error',
						message: 'Error creating a channel',
					},
				});
			});
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
				<Typography variant="h6">Add a Channel</Typography>

				<form onSubmit={submitHandler}>
					<Box display="flex" flexDirection="column" justify="flex-end">
						<Box height="10px" />
						<TextField
							onChange={(e) => {
								if (
									e.target.value.match(/^(?!\s)[a-zA-Z0-9]*$/) &&
									e.target.value.length <= nameMax
								)
									setName(e.target.value);
							}}
							value={name}
							style={{ width: '100%' }}
							variant="outlined"
							required
							type="text"
							label="Channel Name"
							id="channel-name"
							margin="dense"
						/>
						<Box height="10px" />

						<TextField
							onChange={(e) => {
								if (e.target.value.length <= aboutMax)
									setAbout(e.target.value);
							}}
							value={about}
							style={{ width: '100%' }}
							variant="outlined"
							required
							type="text"
							label="About the Channel"
							id="about-the-channel"
							margin="dense"
							multiline
							rowsMax={6}
						/>
						<Box height="18px" />
						<Box display="flex" justifyContent="space-between">
							<Button
								type="submit"
								autoFocus
								variant="contained"
								color="primary"
							>
								Add
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
