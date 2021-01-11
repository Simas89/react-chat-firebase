import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { SET_CHANNEL, SET_CHANNEL_PRIVATE } from 'types/channelTypes';
import { Typography, IconButton, List, ListItem, Box } from '@material-ui/core';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import StarIcon from '@material-ui/icons/Star';
import amber from '@material-ui/core/colors/amber';

import { ModalChannels } from 'components/common';
import firebase from 'config/firebase';

const Wrap = styled.div`
	/* margin-top: ${(p) => p.theme.spacing() * 2}px; */
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
		padding: 0;
		.MuiListItem-root {
			padding: 4px 0 4px 16px;
		}
	}
`;

const channelsRef = firebase.database().ref('channels');
const Channels = () => {
	const dispatch = useDispatch();
	const [channels, setChannels] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [activeChannel, setActiveChannel] = React.useState('');
	const channel = useSelector((state) => state.channel);
	const { currentChannel, starred } = channel;
	const changeChannel = (channel) => {
		dispatch({ type: SET_CHANNEL, payload: channel });
		dispatch({ type: SET_CHANNEL_PRIVATE, payload: false });
	};

	React.useEffect(() => {
		currentChannel && setActiveChannel(currentChannel.id);
	}, [currentChannel]);

	React.useEffect(() => {
		let canInitialChannelSet = true;
		const addListeners = async () => {
			channelsRef.on('child_added', (snap) => {
				setChannels((prevState) => [...prevState, snap.val()]);

				if (canInitialChannelSet) {
					canInitialChannelSet = false;
					changeChannel(snap.val());
				}
			});
		};
		addListeners();

		return () => {
			channelsRef.off();
		};
		//eslint-disable-next-line
	}, []);

	return (
		<Wrap>
			{open && <ModalChannels setOpen={setOpen} channelsRef={channelsRef} />}
			<div className="top-head">
				<SyncAltIcon style={{ margin: 0 }} />
				<Typography style={{ marginLeft: '8px' }} variant="body2">
					CHANNELS ({channels.length && channels.length})
				</Typography>

				<IconButton
					style={{ marginLeft: 'auto' }}
					onClick={() => setOpen(true)}
					color="inherit"
				>
					<AddCircleOutlineIcon />
				</IconButton>
			</div>
			{channels.length && (
				<List>
					{channels.map((el) => (
						<ListItem
							selected={activeChannel === el.id}
							button
							onClick={() => changeChannel(el)}
							key={el.id}
						>
							<Box display="flex" justifyContent="center">
								{currentChannel && starred.includes(el.id) && (
									<StarIcon
										fontSize="small"
										style={{ color: amber[500] }}
									/>
								)}
								<Typography>#{el.name}</Typography>
							</Box>
						</ListItem>
					))}
				</List>
			)}
		</Wrap>
	);
};

export default Channels;
