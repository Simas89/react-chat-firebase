import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_SNACK } from 'types/mainTypes';
import {
	CircularProgress,
	IconButton,
	InputAdornment,
	Paper,
	TextField,
	useMediaQuery,
} from '@material-ui/core';
import styled from 'styled-components';
import SendIcon from '@material-ui/icons/Send';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { ModalFile } from 'components/common';
import firebase from 'config/firebase';
import uuidv4 from 'uuid/v4';
import { Skeleton } from '@material-ui/lab';
import { motion } from 'framer-motion';
import green from '@material-ui/core/colors/green';
import Picker from 'emoji-picker-react';
import { BadgeStyled } from 'components/common';

const Wrap = styled(Paper)`
	position: relative;
	background-color: white;
	/* overflow: hidden; */
	.MuiSkeleton-root {
		position: absolute;
		background-color: ${green['A400']};
	}
	.emoji-picker-react {
		position: absolute !important;
		top: -320px;
		box-shadow: none;
		.tneutral {
			display: none;
		}
		.skin-tones-list {
			display: none;
		}
	}
`;

const SkeletonMotion = motion.custom(Skeleton);

const storageRef = firebase.storage().ref();

const MessageForm = ({ messagesRef, usersRef }) => {
	const dispatch = useDispatch();
	const [message, setMessage] = React.useState('');
	const [file, setFile] = React.useState('');
	const [fileCaption, setFileCaption] = React.useState('');
	const [uploadProgress, setUploadProgress] = React.useState(0);
	const [loading, setLoading] = React.useState(false);
	const [isFileModalOpen, setIsFileModalOpen] = React.useState(false);
	const [emojiPicker, setEmojiPicker] = React.useState(false);
	const smallScreen = useMediaQuery('(max-width:600px)');

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

	const getImageHeightAndWidthFromFile = (file) =>
		new Promise((resolve, reject) => {
			let img = new Image();
			img.src = window.URL.createObjectURL(file);
			img.onload = () => {
				resolve({ width: img.width, height: img.height });
			};
		});

	const uploadFile = () => {
		const pathToUpload = currentChannel.id;
		const filePath = `chat/public/${uuidv4()}.${file.type.split('/')[1]}`;

		const uploadTask = storageRef.child(filePath).put(file);
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setUploadProgress(Math.round(progress));
			},
			(err) => {
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
				setUploadProgress(0);
			},
			() => {
				uploadTask.snapshot.ref.getDownloadURL().then(async (fileUrl) => {
					const imgSize = await getImageHeightAndWidthFromFile(file);
					sendFileMessage(
						{ fileUrl, caption: fileCaption || '', imgSize },
						messagesRef,
						pathToUpload
					);
				});
				setLoading(false);
				setMessage('');
				setFile('');
				setFileCaption('');
				const timeout = setTimeout(() => {
					setUploadProgress(0);
					clearTimeout(timeout);
				}, 200);
			}
		);
	};

	const sendFileMessage = (fileData, ref, pathToUpload) => {
		// console.log(fileUrl, ref, pathToUpload);
		console.log(fileData);
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

	const variants = {
		inProgress: {
			width: `${uploadProgress}%`,
			transition: {
				type: 'tween',
			},
		},
		done: {
			width: '0%',
			transition: {
				duration: 0,
			},
		},
	};

	const onEmojiClick = (event, emojiObject) => {
		console.log(emojiObject);
		setMessage(
			message ? `${message} ${emojiObject.emoji}` : `${emojiObject.emoji}`
		);
		setEmojiPicker(false);
	};

	return (
		<Wrap elevation={8}>
			{emojiPicker && <Picker onEmojiClick={onEmojiClick} />}
			<SkeletonMotion
				variants={variants}
				variant="rect"
				// width={`${uploadProgress}%`}
				height={'100%'}
				animate={loading ? 'inProgress' : 'done'}
			/>
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
								size={smallScreen ? 'small' : 'medium'}
								onClick={sendHandler}
								disabled={(!file && !Boolean(message)) || loading}
								color="primary"
							>
								<SendIcon />
							</IconButton>

							<IconButton onClick={() => setIsFileModalOpen(true)}>
								<BadgeStyled invisible={Boolean(!file)}>
									<AddAPhotoIcon />
								</BadgeStyled>
							</IconButton>
						</InputAdornment>
					),
					startAdornment: (
						<InputAdornment position="start">
							<IconButton
								size={smallScreen ? 'small' : 'medium'}
								onClick={() => setEmojiPicker(!emojiPicker)}
							>
								<InsertEmoticonIcon />
							</IconButton>
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
