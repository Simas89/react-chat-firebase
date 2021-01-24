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
	useMediaQuery,
} from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import SearchIcon from '@material-ui/icons/Search';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import amber from '@material-ui/core/colors/amber';
import firebase from 'config/firebase';
import { BadgeStyled, TooltipCustom, ChannelInfo } from 'components/common';
import { motion } from 'framer-motion';

const Wrap = styled(Paper)`
	background-color: white;
	padding: 10px;
	${(p) => p.theme.breakpoints.down('sm')} {
		padding: 10px 10px 10px 2px;
	}
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
		margin: 0 16px;
		&:hover {
			cursor: pointer;
		}
	}
`;

const MotionTextField = motion.custom(TextField);

const usersRef = firebase.database().ref('users');
const presenceRef = firebase.database().ref('presence');

const MessagesHeader = ({ uniqueUsers, handleSearchChange }) => {
	const dispatch = useDispatch();
	const [isOnline, setIsOnline] = React.useState(false);
	const [animateSearch, setAnimateSearch] = React.useState('CONTRACT');
	const channel = useSelector((state) => state.channel);
	const currentUser = useSelector((state) => state.user.currentUser);
	const { currentChannel, isPrivate, starred } = channel;
	const [openTooltip, setOpenTooltip] = React.useState(false);
	const smallScreen = useMediaQuery('(max-width:600px)');

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
			<Box
				display="flex"
				alignItems="center"
				padding={0}
				height={smallScreen ? '40px' : '60px'}
			>
				<IconButton
					onClick={toggleStarred}
					size={smallScreen ? 'small' : 'medium'}
				>
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
									height: smallScreen ? '50px' : '70px',
									width: smallScreen ? '50px' : '70px',
									margin: smallScreen ? '4px' : '8px',
								}}
								alt={currentChannel.name}
								src={currentChannel.avatar}
							/>
						</BadgeStyled>
					</>
				)}
				<div>
					<Typography
						variant={smallScreen ? 'body1' : 'h5'}
						style={{ marginRight: '8px' }}
					>
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
								items={
									currentChannel && (
										<ChannelInfo
											createdBy={currentChannel.createdBy}
											details={currentChannel.details}
										/>
									)
								}
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
			<ClickAwayListener onClickAway={() => setAnimateSearch('CONTRACT')}>
				<MotionTextField
					onClick={() => setAnimateSearch('EXPAND')}
					animate={{ width: animateSearch === 'EXPAND' ? 200 : 56 }}
					autoFocus={Boolean(animateSearch === 'EXPAND')}
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
					// style={{ width: '56px' }}
				/>
			</ClickAwayListener>
		</Wrap>
	);
};

export default MessagesHeader;
