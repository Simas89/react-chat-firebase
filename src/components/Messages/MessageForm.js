import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_SNACK } from 'types/mainTypes';
import {
	IconButton,
	InputAdornment,
	Paper,
	TextField,
} from '@material-ui/core';
import styled from 'styled-components';
import SendIcon from '@material-ui/icons/Send';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import firebase from 'config/firebase';

const Wrap = styled(Paper)`
	background-color: white;
`;

const MessageForm = ({ messagesRef }) => {
	const dispatch = useDispatch();
	const [message, setMessage] = React.useState('');
	const [loading, setLoading] = React.useState(false);

	const currentChannel = useSelector((state) => state.channel.currentChannel);
	const currentUser = useSelector((state) => state.user.currentUser);

	const sendMessage = () => {
		if (message) {
			setLoading(true);
			messagesRef
				.child(currentChannel.id)
				.push()
				.set(createMessage())
				.then(() => {
					setLoading(false);
					setMessage('');
				})
				.catch(() => {
					setLoading(false);
					dispatch({
						type: SET_SNACK,
						payload: {
							open: true,
							severity: 'error',
							message: 'Error sending a message',
						},
					});
				});
		}
	};

	const createMessage = () => {
		const newMessage = {
			content: message,
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			user: {
				id: currentUser.uid,
				name: currentUser.displayName,
				avatar: currentUser.photoURL,
			},
		};
		return newMessage;
	};

	return (
		<Wrap elevation={8}>
			<TextField
				id="outlined-basic"
				variant="outlined"
				placeholder="Write your message"
				fullWidth
				multiline
				rowsMax={5}
				value={message}
				name="message"
				onChange={(e) => setMessage(e.target.value)}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={sendMessage}
								disabled={!Boolean(message) || loading}
								color="primary"
							>
								<SendIcon />
							</IconButton>
							<IconButton>
								<CloudUploadIcon />
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
		</Wrap>
	);
};

export default MessageForm;
