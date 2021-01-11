import React from 'react';
import firebase from 'config/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { SET_USERS, SET_USERS_ALL } from 'types/usersTypes';
import { SET_CHANNEL, SET_CHANNEL_PRIVATE } from 'types/channelTypes';
import { Typography, List, ListItem, Box } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import styled from 'styled-components';
import StarIcon from '@material-ui/icons/Star';
import amber from '@material-ui/core/colors/amber';

const StyledDiv = styled.div`
	color: white;
	.top-head {
		display: flex;
		align-items: center;
	}
	.Mui-selected {
		border-radius: 3px;
		background-color: ${(p) => p.theme.palette.primary.dark} !important;
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
	}
`;

const usersRef = firebase.database().ref('users');
const connectedRef = firebase.database().ref('.info/connected');
const presenceRef = firebase.database().ref('presence');

const DirectMessages = () => {
	const dispatch = useDispatch();

	const [presenceTrig, setPresenceTrig] = React.useState(0);
	const users = useSelector((state) => state.users);
	const [activeChannel, setActiveChannel] = React.useState('');
	const currentUser = useSelector((state) => state.user.currentUser);
	const channel = useSelector((state) => state.channel);
	const { currentChannel, starred } = channel;

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
		const addListeners = (currentUserUid) => {
			usersRef.on('child_added', (snap) => {
				if (currentUserUid !== snap.key) {
					let user = snap.val();
					user['uid'] = snap.key;
					user['isOnline'] = 'offline';
					// setUsers((state) => [...state, user]);
					dispatch({ type: SET_USERS, payload: user });
				}
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
	}, [currentUser, dispatch]);

	const changeChannel = (user) => {
		const channelId = getChannelId(user.uid);
		const channelData = {
			id: channelId,
			name: user.name,
		};
		dispatch({ type: SET_CHANNEL, payload: channelData });
		dispatch({ type: SET_CHANNEL_PRIVATE, payload: true });
	};

	const getChannelId = (userId) => {
		const currentUserId = currentUser.uid;
		return userId < currentUserId
			? `${userId}${currentUserId}`
			: `${currentUserId}${userId}`;
	};

	return (
		<StyledDiv>
			<div className="top-head">
				<MailIcon style={{ margin: 0 }} />
				<Typography style={{ marginLeft: '8px' }} variant="body2">
					DIRECT MESSAGES ({users.length})
				</Typography>
			</div>
			{users.length && (
				<List>
					{users.map((el) => (
						<ListItem
							selected={activeChannel.includes(el.uid)}
							key={el.uid}
							button
							onClick={() => changeChannel(el)}
						>
							<Box
								display="flex"
								justifyContent="center"
								alignItems="center"
							>
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

								<Typography noWrap>{el.name}</Typography>

								{el.isOnline === 'online' && (
									<FiberManualRecordIcon className="is-online" />
								)}
							</Box>

							{/* <Box display="flex" justifyContent="center">
									<StarIcon
										fontSize="small"
										style={{ color: amber[500] }}
									/>
									<Typography>{el.name}</Typography>
									{el.isOnline === 'online' && (
										<FiberManualRecordIcon className="is-online" />
									)}
								</Box> */}
						</ListItem>
					))}
				</List>
			)}
		</StyledDiv>
	);
};

export default DirectMessages;
