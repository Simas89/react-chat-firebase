import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_SNACK } from 'types/mainTypes';
import {
	CircularProgress,
	IconButton,
	InputAdornment,
	Paper,
	TextField,
} from '@material-ui/core';
import styled from 'styled-components';
import SendIcon from '@material-ui/icons/Send';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { ModalFile } from 'components/common';
import firebase from 'config/firebase';
import uuidv4 from 'uuid/v4';

const Wrap = styled(Paper)`
	background-color: white;
`;

const storageRef = firebase.storage().ref();

const MessageForm = ({ messagesRef, usersRef }) => {
	const dispatch = useDispatch();
	const [message, setMessage] = React.useState('');
	const [file, setFile] = React.useState('');
	const [fileCaption, setFileCaption] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [isFileModalOpen, setIsFileModalOpen] = React.useState(false);

	const currentChannel = useSelector((state) => state.channel.currentChannel);
	const currentUser = useSelector((state) => state.user.currentUser);
	const users = useSelector((state) => state.users);

	const extractUserId = () => {
		let str = currentChannel.id;
		str = str.replace(currentUser.uid, '');

		return str;
	};

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

			if (currentChannel.id.length > 25) {
				usersRef
					.child(extractUserId())
					.child('newMessages')
					.child(currentChannel.id)
					.set(firebase.database.ServerValue.increment(1));
			} else {
				users.forEach((el) => {
					usersRef
						.child(el.uid)
						.child('newMessages')
						.child(currentChannel.id)
						.set(firebase.database.ServerValue.increment(1));
				});
			}
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

	const uploadFile = () => {
		const pathToUpload = currentChannel.id;
		const ref = messagesRef;
		const filePath = `chat/public/${uuidv4()}.${file.type.split('/')[1]}`;

		storageRef
			.child(filePath)
			.put(file)
			.then((snap) => {
				snap.ref
					.getDownloadURL()
					.then((fileUrl) =>
						sendFileMessage(
							{ fileUrl, caption: fileCaption || '' },
							ref,
							pathToUpload
						)
					);
				setLoading(false);
				setMessage('');
				setFile('');
				setFileCaption('');
			})
			.catch(() => {
				dispatch({
					type: SET_SNACK,
					payload: {
						open: true,
						severity: 'error',
						message: 'Error uploading image',
					},
				});
				setLoading(false);
				setMessage('');
				setFile('');
				setFileCaption('');
			});
	};

	const sendFileMessage = (fileData, ref, pathToUpload) => {
		// console.log(fileUrl, ref, pathToUpload);
		ref.child(pathToUpload)
			.push()
			.set(createMessage(fileData))
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

	const sendHandler = () => {
		if (file) {
			uploadFile();
			setLoading(true);
		} else {
			sendMessage();
			setLoading(true);
		}
	};

	return (
		<Wrap elevation={8}>
			{isFileModalOpen && (
				<ModalFile
					setIsFileModalOpen={setIsFileModalOpen}
					file={file}
					setFile={setFile}
					fileCaption={fileCaption}
					setFileCaption={setFileCaption}
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
				disabled={loading}
				onChange={(e) => setMessage(e.target.value)}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={sendHandler}
								disabled={(!file && !Boolean(message)) || loading}
								color="primary"
							>
								<SendIcon />
							</IconButton>
							<IconButton onClick={() => setIsFileModalOpen(true)}>
								<AddAPhotoIcon
									style={{ color: file ? 'blue' : 'gray' }}
								/>
							</IconButton>
						</InputAdornment>
					),
					startAdornment: (
						<InputAdornment position="start">
							{loading && (
								<CircularProgress
									size={30}
									style={{ position: 'absolute' }}
								/>
							)}
						</InputAdornment>
					),
				}}
			/>
		</Wrap>
	);
};

export default MessageForm;
