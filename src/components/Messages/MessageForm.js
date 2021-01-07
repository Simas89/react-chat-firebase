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
import { ModalFile } from 'components/common';
import firebase from 'config/firebase';
import uuidv4 from 'uuid/v4';

const Wrap = styled(Paper)`
	background-color: white;
`;

const storageRef = firebase.storage().ref();

const MessageForm = ({ messagesRef }) => {
	const dispatch = useDispatch();
	const [message, setMessage] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [isFileModalOpen, setIsFileModalOpen] = React.useState(false);

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

	const createMessage = (fileUrl = null) => {
		const newMessage = {
			content: message,
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			user: {
				id: currentUser.uid,
				name: currentUser.displayName,
				avatar: currentUser.photoURL,
			},
		};

		if (fileUrl) {
			newMessage['image'] = fileUrl;
		} else {
		}

		return newMessage;
	};

	const uploadFile = (file) => {
		const pathToUpload = currentChannel.id;
		const ref = messagesRef;
		const filePath = `chat/public/${uuidv4()}.${file.type.split('/')[1]}`;

		storageRef
			.child(filePath)
			.put(file)
			.then((snap) => {
				setIsFileModalOpen(false);
				snap.ref
					.getDownloadURL()
					.then((fileUrl) => sendFileMessage(fileUrl, ref, pathToUpload));
			})
			.catch(() => {
				setIsFileModalOpen(false);
				dispatch({
					type: SET_SNACK,
					payload: {
						open: true,
						severity: 'error',
						message: 'Error uploading image',
					},
				});
			});
	};

	const sendFileMessage = (fileUrl, ref, pathToUpload) => {
		// console.log(fileUrl, ref, pathToUpload);
		ref.child(pathToUpload)
			.push()
			.set(createMessage(fileUrl))
			.then(() => {})
			.catch((err) => {
				console.log(err);
				dispatch({
					type: SET_SNACK,
					payload: {
						open: true,
						severity: 'error',
						message: 'Error sending image',
					},
				});
			});
	};

	return (
		<Wrap elevation={8}>
			{isFileModalOpen && (
				<ModalFile
					setIsFileModalOpen={setIsFileModalOpen}
					uploadFile={uploadFile}
				/>
			)}
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
							<IconButton onClick={() => setIsFileModalOpen(true)}>
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
