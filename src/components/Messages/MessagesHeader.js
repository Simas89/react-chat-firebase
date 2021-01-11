import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_SNACK } from 'types/mainTypes';
import { SET_STARRED } from 'types/channelTypes';
import styled from 'styled-components';
import {
	Paper,
	Typography,
	Box,
	TextField,
	InputAdornment,
	IconButton,
} from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import SearchIcon from '@material-ui/icons/Search';
import amber from '@material-ui/core/colors/amber';
import firebase from 'config/firebase';

const Wrap = styled(Paper)`
	background-color: white;
	padding: 10px;
	position: relative;
	z-index: 0;
	.MuiTextField-root {
		float: right;
		/* position: absolute;
		right: 10px;
		bottom: 10px; */
		margin-left: auto;
	}
`;

const usersRef = firebase.database().ref('users');

const MessagesHeader = ({ uniqueUsers, handleSearchChange }) => {
	const dispatch = useDispatch();
	const channel = useSelector((state) => state.channel);
	const currentUser = useSelector((state) => state.user.currentUser);
	const { currentChannel, isPrivate, starred } = channel;

	React.useEffect(() => {
		if (currentUser && currentChannel) {
			updateStarred();
		}
	}, [currentUser, currentChannel]);

	const toggleStarred = () => {
		if (currentChannel && !starred.includes(currentChannel.id)) {
			usersRef
				.child(`${currentUser.uid}/starred`)
				.update({
					[currentChannel.id]: {
						name: currentChannel.name,
						details: currentChannel.details
							? currentChannel.details
							: null,

						createdBy: {
							avataer: currentChannel.createdBy
								? currentChannel.createdBy.avataer
								: null,
							name: currentChannel.createdBy
								? currentChannel.createdBy.name
								: null,
						},
					},
				})
				.then(() => updateStarred());
		} else if (currentChannel) {
			usersRef
				.child(`${currentUser.uid}/starred`)
				.child(currentChannel.id)
				.remove((err) => {
					if (err) {
						console.log(err);
						dispatch({
							type: SET_SNACK,
							payload: {
								open: true,
								severity: 'error',
								message: 'Error unstarring a channel',
							},
						});
					}
				})
				.then(() => updateStarred());
		}
	};

	const updateStarred = () => {
		usersRef
			.child(currentUser.uid)
			.child('starred')
			.once('value')
			.then((data) => {
				const channelIds = data.val() ? Object.keys(data.val()) : [];
				dispatch({ type: SET_STARRED, payload: channelIds });
			});
	};

	return (
		<Wrap elevation={8}>
			<Box display="flex" alignItems="center" padding={0} height="50px">
				<IconButton onClick={toggleStarred}>
					{currentChannel && starred.includes(currentChannel.id) ? (
						<StarIcon style={{ color: amber[500] }} fontSize="large" />
					) : (
						<StarBorderIcon fontSize="large" />
					)}
				</IconButton>

				<div>
					<Typography variant="h5">
						<strong>
							{isPrivate ? '@' : '#'}
							{currentChannel && currentChannel.name}
						</strong>
					</Typography>

					{!isPrivate && (
						<Typography variant="body2">
							{uniqueUsers.length}{' '}
							{uniqueUsers.length === 1 ? 'User' : 'Users'}
						</Typography>
					)}
				</div>
				<TextField
					onChange={handleSearchChange}
					id="outlined-basic"
					variant="outlined"
					placeholder="Search Messages"
					size="small"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<IconButton size="small">
									<SearchIcon />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
			</Box>
		</Wrap>
	);
};

export default MessagesHeader;
