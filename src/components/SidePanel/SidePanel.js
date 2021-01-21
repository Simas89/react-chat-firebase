import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SET_SHOW_ONLY_STARRED } from 'types/channelTypes';
import styled from 'styled-components';
import UserPanel from 'components/SidePanel/UserPanel';
import Channels from 'components/SidePanel/Channels';
import DirectMessages from 'components/SidePanel/DirectMessages';
import { Box, Button, ButtonGroup, Divider, Paper } from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';

const Wrap = styled.div`
	overflow: hidden;
	z-index: 200;
	background-color: ${(p) => p.theme.palette.white};
	padding: 10px 10px 10px 10px;
	height: 100%;
	width: 350px;
	.MuiPaper-root {
		padding: 8px;
		height: 100%;
	}
`;

const SidePanel = React.memo(() => {
	const dispatch = useDispatch();
	const showOnlyStarred = useSelector(
		(state) => state.channel.showOnlyStarred
	);

	const forceRender = React.useState()[1].bind(null, {});
	return (
		<Wrap>
			<Paper elevation={8}>
				<Box
					display="flex"
					flexDirection="column"
					style={{ height: '100%' }}
				>
					<div>
						<UserPanel />
						<Box height={8} />
						<Divider />
						<Box height={8} />
						<ButtonGroup
							disableRipple
							variant="contained"
							size="small"
							fullWidth
						>
							<Button
								color={!showOnlyStarred && 'primary'}
								onClick={() =>
									dispatch({
										type: SET_SHOW_ONLY_STARRED,
										payload: false,
									})
								}
							>
								All
							</Button>
							<Button
								color={showOnlyStarred && 'primary'}
								onClick={() =>
									dispatch({
										type: SET_SHOW_ONLY_STARRED,
										payload: true,
									})
								}
							>
								starred
							</Button>
						</ButtonGroup>
					</div>

					<Box
						display="flex"
						flexDirection="column"
						style={{
							flexGrow: 1,
							// height: '100%',
						}}
					>
						<Scrollbars>
							<Channels forceRender={forceRender} />
							<DirectMessages forceRender={forceRender} />
						</Scrollbars>
					</Box>
				</Box>
			</Paper>
		</Wrap>
	);
});

export default SidePanel;
