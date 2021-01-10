import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { SET_CHANNEL, SET_CHANNEL_PRIVATE } from 'types/channelTypes';
import { Typography, IconButton, List, ListItem } from '@material-ui/core';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { ModalChannels } from 'components/common';
import firebase from 'config/firebase';

const channelsRef = firebase.database().ref('channels');

const Wrap = styled.div`
	margin-top: ${(p) => p.theme.spacing() * 2}px;
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

const Channels = () => {
	const dispatch = useDispatch();
	const [channels, setChannels] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [activeChannel, setActiveChannel] = React.useState('');
	const currentChannel = useSelector((state) => state.channel.currentChannel);

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
			let loadedChannels = [];
			channelsRef.on('child_added', (snap) => {
				loadedChannels.push(snap.val());
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
							<Typography noWrap variant="body2">
								# {el.name}
							</Typography>
						</ListItem>
					))}
				</List>
			)}
		</Wrap>
	);
};

export default Channels;
