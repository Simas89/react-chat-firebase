import React from 'react';
import firebase from 'config/firebase';
import { useSelector } from 'react-redux';
import { Box, Button, Grid, Typography, Avatar } from '@material-ui/core';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import styled from 'styled-components';
import { TooltipCustom } from 'components/common';

const Wrap = styled.div`
	padding: 10px;
	color: white;
	header {
		display: flex;
	}
	.user {
		&:hover {
			cursor: pointer;
		}
	}
	.MuiButton-root {
		text-transform: none;
		&:hover {
			background-color: inherit !important;
		}
	}
`;

const UserPanel = () => {
	const currentUser = useSelector((state) => state.user.currentUser);
	console.log(currentUser);
	const handleSignOut = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				console.log('signed out!');
			});
	};
	return (
		<Wrap>
			<header>
				<ForumOutlinedIcon fontSize="large" />
				<Typography variant="h4" style={{ color: 'white' }}>
					DevChat
				</Typography>
			</header>

			<TooltipCustom
				placement="bottom-start"
				arrow={false}
				items={
					<>
						<Button>Change avatar</Button>
						<Button onClick={handleSignOut}>Sign Out</Button>
					</>
				}
			>
				<Box display="flex" flexGrow={0} margin="auto">
					<Avatar
						alt={currentUser.displayName}
						src={currentUser.photoURL}
						className=""
					/>
					<Button
						style={{ color: 'white' }}
						disableElevation
						disableRipple
					>
						{currentUser.displayName}
						<span
							style={{
								fontSize: '.5rem',
								marginLeft: '5px',
							}}
						>
							▼
						</span>
					</Button>
				</Box>
			</TooltipCustom>
		</Wrap>
	);
};

export default UserPanel;
