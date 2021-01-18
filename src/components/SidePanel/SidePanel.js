import React from 'react';
import { useDispatch } from 'react-redux';
import { SET_SHOW_ONLY_STARRED } from 'types/channelTypes';
import styled from 'styled-components';
import UserPanel from 'components/SidePanel/UserPanel';
import Channels from 'components/SidePanel/Channels';
import DirectMessages from 'components/SidePanel/DirectMessages';
import { Box, Button, ButtonGroup, Divider, Paper } from '@material-ui/core';

const Wrap = styled.div`
	max-height: 100%;
	z-index: 200;
	background-color: ${(p) => p.theme.palette.white};
	/* background-color: white; */
	padding: 10px 0 16px 16px;
	height: 100%;
	.MuiPaper-root {
		padding: 8px;
		height: 100%;
	}
`;

const SidePanel = React.memo(() => {
	const dispatch = useDispatch();
	return (
		<Wrap>
			<Paper elevation={8}>
				<UserPanel />
				<Box height={8} />
				<Divider />
				<Box height={8} />
				<ButtonGroup disableRipple variant="text" size="small" fullWidth>
					<Button
						onClick={() =>
							dispatch({ type: SET_SHOW_ONLY_STARRED, payload: false })
						}
					>
						All
					</Button>
					<Button
						onClick={() =>
							dispatch({ type: SET_SHOW_ONLY_STARRED, payload: true })
						}
					>
						starred
					</Button>
				</ButtonGroup>

				<Channels />
				<DirectMessages />
			</Paper>
		</Wrap>
	);
});

export default SidePanel;
