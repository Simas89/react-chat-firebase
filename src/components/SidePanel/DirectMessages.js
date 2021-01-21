import React from 'react';
import firebase from 'config/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { SET_USERS, SET_USERS_ALL } from 'types/usersTypes';
import { SET_CHANNEL, SET_CHANNEL_PRIVATE } from 'types/channelTypes';
import {
	Typography,
	List,
	ListItem,
	Box,
	Badge,
	Divider,
} from '@material-ui/core';
import styled from 'styled-components';
import StarIcon from '@material-ui/icons/Star';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import amber from '@material-ui/core/colors/amber';
import { BadgeStyled } from 'components/common';
import { motion } from 'framer-motion';

const StyledDiv = styled.div`
	color: white;
	color: black;
	.top-head {
		display: flex;
		align-items: center;
		.heading {
			font-family: 'Hiddencocktails' !important;
			font-size: 2rem;
			user-select: none;
			&:hover {
				cursor: pointer;
			}
		}
	}
	.Mui-selected {
		border-radius: 3px;
		background-color: ${(p) => p.theme.palette.primary.dark};
		background-color: rgba(3, 169, 244, 0.2) !important;
		box-shadow: 0 0 0px 1px rgba(3, 169, 244, 0.3);
	}

	.MuiList-root {
		.MuiListItem-root {
			padding: 4px 0 4px 16px;
		}
	}

	.is-online {
		margin-left: 6px;
		font-size: 0.8rem;
		color: white;
		color: black;
	}
	.MuiBadge-root {
		color: red;
		background-color: red;
	}
`;

const ExpandLessIconMotion = motion.custom(ExpandLessIcon);

const usersRef = firebase.database().ref('users');
const connectedRef = firebase.database().ref('.info/connected');
const presenceRef = firebase.database().ref('presence');

const DirectMessages = ({ forceRender }) => {
	const dispatch = useDispatch();

	const [presenceTrig, setPresenceTrig] = React.useState(0);
	const users = useSelector((state) => state.users);
	const [showList, setShowList] = React.useState(true);

	const [activeChannel, setActiveChannel] = React.useState('');
	const currentUser = useSelector((state) => state.user.currentUser);
	const channel = useSelector((state) => state.channel);
	const { currentChannel, starred, showOnlyStarred, newMessages } = channel;

	React.useEffect(() => {
		currentChannel && setActiveChannel(currentChannel.id);
	}, [currentChannel]);

	const addStatusToUser = (userId, isOnline) => {
		const updatedUsers = users.reduce((acc, user) => {
			if (user.uid === userId) {
				user['isOnline'] = `${isOnline ? 'online' : 'offline'}`;
			}
			return acc.concat(user);
		}, []);

		dispatch({ type: SET_USERS_ALL, payload: updatedUsers });
	};

	React.useEffect(() => {
		addStatusToUser(presenceTrig.key, presenceTrig.isOnline);
		//eslint-disable-next-line
	}, [presenceTrig]);

	React.useEffect(() => {
		usersRef.off();
		dispatch({ type: SET_USERS, payload: [] });
		const parseObjToArray = (obj) => {
			let array = [];
			for (const [key, value] of Object.entries(obj)) {
				array.push({ ...value, uid: key, isOnline: 'offline' });
			}
			return array;
		};

		const addListeners = (currentUserUid) => {
			usersRef.once('value', (snap) => {
				const users = parseObjToArray({ ...snap.val() });
				const index = users.map((e) => e.uid).indexOf(currentUserUid);
				users.splice(index, 1);
				dispatch({ type: SET_USERS, payload: users });
			});

			usersRef.limitToLast(1).on('child_added', (snap) => {
				let user = snap.val();
				user['uid'] = snap.key;
				user['isOnline'] = 'offline';
				users.legth && dispatch({ type: SET_USERS, payload: [user] });
			});

			connectedRef.on('value', (snap) => {
				if (snap.val() === true) {
					const ref = presenceRef.child(currentUserUid);
					ref.set(true);
					ref.onDisconnect().remove((err) => {
						err && console.log(err);
					});
				}
			});

			presenceRef.on('child_added', (snap) => {
				if (currentUserUid !== snap.key) {
					setPresenceTrig({ key: snap.key, isOnline: true });
				}
			});

			presenceRef.on('child_removed', (snap) => {
				if (currentUserUid !== snap.key) {
					setPresenceTrig({ key: snap.key, isOnline: false });
				}
			});
		};

		if (currentUser) {
			addListeners(currentUser.uid);
		}
		return () => {
			usersRef.off();
			dispatch({ type: SET_USERS_ALL, payload: [] });
		};
	}, [currentUser, dispatch, users.legth]);

	const changeChannel = (user) => {
		const channelId = getChannelId(user.uid);
		if (channelId !== currentChannel.id) {
			const channelData = {
				id: channelId,
				name: user.name,
				avatar: user.avatar,
			};
			dispatch({ type: SET_CHANNEL, payload: channelData });
			dispatch({ type: SET_CHANNEL_PRIVATE, payload: true });
		}
	};

	const getChannelId = (userId) => {
		const currentUserId = currentUser.uid;
		return userId < currentUserId
			? `${userId}${currentUserId}`
			: `${currentUserId}${userId}`;
	};

	const parseChannelItem = (el) => {
		const index = newMessages
			? newMessages
					.map((e) => e.channelId)
					.indexOf(
						el.uid < currentUser.uid
							? el.uid + currentUser.uid
							: currentUser.uid + el.uid
					)
			: -1;

		return (
			<ListItem
				selected={activeChannel.includes(el.uid)}
				key={el.uid}
				button
				onClick={() => changeChannel(el)}
			>
				<Box display="flex" justifyContent="center" alignItems="center">
					{currentChannel &&
						starred.includes(
							el.uid < currentUser.uid
								? el.uid + currentUser.uid
								: currentUser.uid + el.uid
						) && (
							<StarIcon
								fontSize="small"
								style={{
									color: amber[500],
								}}
							/>
						)}

					<Typography
						variant="body2"
						color="textPrimary"
						noWrap
						style={{ paddingRight: '5px' }}
					>
						<i>{el.name}</i>
					</Typography>
					<Box marginLeft={1.5}>
						<BadgeStyled invisible={el.isOnline !== 'online'} />
					</Box>
				</Box>
				<Badge
					color="error"
					badgeContent={index !== -1 ? newMessages[index].newMessages : 0}
					variant="standard"
					style={{ marginLeft: 'auto', marginRight: '16px' }}
				/>
			</ListItem>
		);
	};

	const channelsOnDisplayCount = () => {
		const num = users.reduce((acc, el) => {
			showOnlyStarred
				? starred.includes(getChannelId(el.uid)) && acc++
				: acc++;
			return acc;
		}, 0);
		return num;
	};

	return (
		<StyledDiv>
			<div className="top-head" onClick={() => setShowList(!showList)}>
				<Typography
					style={{ marginLeft: '8px' }}
					variant="body2"
					color="primary"
					className="heading"
				>
					DIRECT MESSAGES
				</Typography>
				<ExpandLessIconMotion
					className="heading"
					color="primary"
					style={{ marginTop: '5px' }}
					animate={{ rotate: showList ? 180 : 0 }}
					transition={{ type: 'spring', mass: 1, damping: 15 }}
				/>
			</div>
			{users.length && (
				<motion.div
					style={{ overflow: 'hidden' }}
					initial={!showList && { height: 0 }}
					animate={{
						height: showList ? channelsOnDisplayCount() * 28 + 16 : 0,
					}}
					transition={{ type: 'tween' }}
					onAnimationComplete={forceRender}
				>
					<List>
						{users.map((el) =>
							showOnlyStarred
								? starred.includes(getChannelId(el.uid)) &&
								  parseChannelItem(el)
								: parseChannelItem(el)
						)}
					</List>
				</motion.div>
			)}
			<Divider />
		</StyledDiv>
	);
};

export default DirectMessages;
