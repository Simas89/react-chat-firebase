import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { SET_CHANNEL, SET_CHANNEL_PRIVATE } from 'types/channelTypes';
import { SET_SWIPED_SCREEN } from 'types/mainTypes';
import { clearCurrentChannelNewMessages } from 'actions/channelActions';
import {
	Typography,
	List,
	ListItem,
	Box,
	Fab,
	useTheme,
	Badge,
	Divider,
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import AddIcon from '@material-ui/icons/Add';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import amber from '@material-ui/core/colors/amber';
import { motion } from 'framer-motion';

import { ModalChannels } from 'components/common';
import firebase from 'config/firebase';

const Wrap = styled.div`
	/* margin-top: ${(p) => p.theme.spacing() * 2}px; */
	color: white;
	color: black;
	margin-top: 16px;

	.top-head {
		display: flex;
		align-items: center;
		margin-top: 8px;
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
`;

const ExpandLessIconMotion = motion.custom(ExpandLessIcon);

const channelsRef = firebase.database().ref('channels');

const Channels = ({ forceRender }) => {
	const dispatch = useDispatch();
	const [channels, setChannels] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [showList, setShowList] = React.useState(true);
	const [activeChannel, setActiveChannel] = React.useState('');
	const channel = useSelector((state) => state.channel);
	const { currentChannel, starred, showOnlyStarred, newMessages } = channel;
	const changeChannel = (channel, shiftScreen = true) => {
		dispatch({ type: SET_CHANNEL, payload: channel });
		dispatch({ type: SET_CHANNEL_PRIVATE, payload: false });
		if (shiftScreen) {
			dispatch({
				type: SET_SWIPED_SCREEN,
				payload: { direction: 'Right' },
			});
		}
	};

	const theme = useTheme();

	React.useEffect(() => {
		if (currentChannel) {
			setActiveChannel(currentChannel.id);
			dispatch(clearCurrentChannelNewMessages());
		}
	}, [currentChannel, dispatch]);

	React.useEffect(() => {
		const parseObjToArray = (obj) => {
			let array = [];
			//eslint-disable-next-line
			for (const [key, value] of Object.entries(obj)) {
				array.push({ ...value });
			}
			return array;
		};

		let canInitialChannelSet = true;
		const addListeners = async () => {
			channelsRef.once('value', (snap) => {
				setChannels(parseObjToArray(snap.val()));
				channelsRef.off('value');

				if (canInitialChannelSet) {
					canInitialChannelSet = false;
					changeChannel(parseObjToArray(snap.val())[0], false);
				}
			});

			channelsRef.limitToLast(1).on('child_added', (snap) => {
				setChannels((prevState) => [...prevState, snap.val()]);
			});
		};
		addListeners();

		return () => {
			channelsRef.off();
		};
		//eslint-disable-next-line
	}, []);

	const parseChannelItem = (el) => {
		const index = newMessages
			? newMessages.map((e) => e.channelId).indexOf(el.id)
			: -1;

		return (
			<ListItem
				style={{ paddingLeft: '4px' }}
				selected={activeChannel === el.id}
				button
				onClick={() => changeChannel(el)}
				key={el.id}
			>
				<Box display="flex" justifyContent="center">
					{starred.includes(el.id) && (
						<StarIcon fontSize="small" style={{ color: amber[500] }} />
					)}
					<Typography
						variant="body2"
						color="textPrimary"
						noWrap
						style={{ paddingRight: '5px' }}
					>
						<i>{el.name} </i>
					</Typography>
				</Box>
				<Badge
					color="error"
					badgeContent={
						index !== -1 ? newMessages[index].newMessages : null
					}
					variant="standard"
					style={{ marginLeft: 'auto', marginRight: '16px' }}
				/>
			</ListItem>
		);
	};

	const channelsOnDisplayCount = () => {
		const num = channels.reduce((acc, el) => {
			showOnlyStarred ? starred.includes(el.id) && acc++ : acc++;
			return acc;
		}, 0);
		return num;
	};

	return (
		<Wrap>
			{open && <ModalChannels setOpen={setOpen} channelsRef={channelsRef} />}
			<div className="top-head">
				<Box
					display="flex"
					alignItems="center"
					onClick={() => setShowList(!showList)}
				>
					<Typography
						style={{ marginLeft: '8px' }}
						className="heading"
						color="primary"
						variant="body2"
					>
						CHANNELS
					</Typography>

					<ExpandLessIconMotion
						className="heading"
						color="primary"
						style={{ marginTop: '5px' }}
						animate={{ rotate: showList ? 180 : 0 }}
						transition={{ type: 'spring', mass: 1, damping: 15 }}
					/>
				</Box>

				<Fab
					size="medium"
					style={{
						marginLeft: 'auto',
						marginRight: '8px',
						background: theme.classBg.background,
					}}
					color="primary"
					aria-label="add"
					onClick={() => setOpen(true)}
				>
					<AddIcon />
				</Fab>
			</div>
			{channels.length && (
				<motion.div
					style={{ overflow: 'hidden' }}
					initial={!showList && { height: 0 }}
					animate={{
						height: showList ? channelsOnDisplayCount() * 28 + 16 : 0,
					}}
					transition={{ type: 'tween' }}
					onAnimationComplete={forceRender}
				>
					<List style={{ padding: '2px 8px' }}>
						{channels.map((el) =>
							showOnlyStarred
								? starred.includes(el.id) && parseChannelItem(el)
								: parseChannelItem(el)
						)}
					</List>
				</motion.div>
			)}

			<Divider />
		</Wrap>
	);
};

export default Channels;
