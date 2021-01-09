import React from 'react';
import { useSelector } from 'react-redux';
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
import SearchIcon from '@material-ui/icons/Search';

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

const MessagesHeader = ({ uniqueUsers, handleSearchChange }) => {
	const currentChannel = useSelector((state) => state.channel.currentChannel);
	return (
		<Wrap elevation={8}>
			<Box display="flex" alignItems="center" padding={0}>
				<IconButton>
					<StarBorderIcon fontSize="large" />
				</IconButton>
				<div>
					<Typography variant="h5">
						<strong>{currentChannel && currentChannel.name}</strong>
					</Typography>

					<Typography variant="body2">
						{uniqueUsers.length}{' '}
						{uniqueUsers.length === 1 ? 'User' : 'Users'}
					</Typography>
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
