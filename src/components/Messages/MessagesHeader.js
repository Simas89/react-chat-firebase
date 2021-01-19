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
	Avatar,
	ClickAwayListener,
	Tooltip,
} from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import SearchIcon from '@material-ui/icons/Search';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import amber from '@material-ui/core/colors/amber';
import firebase from 'config/firebase';
import { BadgeStyled, TooltipCustom } from 'components/common';

const Wrap = styled(Paper)`
	background-color: white;
	padding: 10px;
	position: relative;
	z-index: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.MuiAvatar-root {
		margin: 0 8px;
	}
	.MuiBadge-colorPrimary {
		background-color: red;
	}
	.info {
		font-size: 1.5rem;
		color: ${(p) => p.theme.palette.text.secondary};
		margin-left: 16px;
		&:hover {
			cursor: pointer;
		}
	}
`;

const usersRef = firebase.database().ref('users');
const presenceRef = firebase.database().ref('presence');

const MessagesHeader = ({ uniqueUsers, handleSearchChange }) => {
	const dispatch = useDispatch();
	const [isOnline, setIsOnline] = React.useState(false);
	const channel = useSelector((state) => state.channel);
	const currentUser = useSelector((state) => state.user.currentUser);
	const { currentChannel, isPrivate, starred } = channel;
	const [openTooltip, setOpenTooltip] = React.useState(false);

	const handleTooltipClose = () => {
		setOpenTooltip(false);
	};

	const handleTooltipOpen = () => {
		setOpenTooltip(true);
	};

	React.useEffect(() => {
		const extractUserId = () => {
			let str = currentChannel.id;
			str = str.replace(currentUser.uid, '');

			return str;
		};

		if (currentUser && currentChannel) {
			updateStarred();
			// presenceRef.off();
			presenceRef
				.child(extractUserId())
				.on('value', (snap) => setIsOnline(snap.val()));
		}

		//eslint-disable-next-line
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
			<Box display="flex" alignItems="center" padding={0} height="60px">
				<IconButton onClick={toggleStarred}>
					{currentChannel && starred.includes(currentChannel.id) ? (
						<StarIcon style={{ color: amber[500] }} fontSize="large" />
					) : (
						<StarBorderIcon fontSize="large" />
					)}
				</IconButton>
				{isPrivate && (
					<>
						<BadgeStyled invisible={!isOnline}>
							<Avatar
								style={{
									height: '70px',
									width: '70px',
								}}
								alt={currentUser.displayName}
								src={currentUser.photoURL}
							/>
						</BadgeStyled>
					</>
				)}
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
				{!isPrivate && (
					<ClickAwayListener onClickAway={handleTooltipClose}>
						<div>
							<TooltipCustom
								onClose={handleTooltipClose}
								isOpen={openTooltip}
								placement="bottom-start"
								arrow={false}
								items={<>lol</>}
							>
								<InfoOutlinedIcon
									onClick={handleTooltipOpen}
									className="info"
								/>
							</TooltipCustom>
						</div>
					</ClickAwayListener>
				)}
			</Box>

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
		</Wrap>
	);
};

export default MessagesHeader;
