import React from 'react';
import firebase from 'config/firebase';
import { useSelector } from 'react-redux';
import { Box, Button, Typography, Avatar } from '@material-ui/core';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import styled from 'styled-components';
import { TooltipCustom } from 'components/common';

const Wrap = styled.div`
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

const AvatarReloaded = (currentUser) => {
	const [status, setStatus] = React.useState(false);
	let interval = React.useRef(0);

	React.useEffect(() => {
		const imageExists = (url, cb) => {
			fetch(url, { method: 'HEAD' })
				.then((res) => {
					if (res.ok) {
						cb(true);
					} else {
						cb(true);
					}
				})
				.catch((err) => console.log('Error:', err));
		};

		interval.current = setInterval(() => {
			imageExists(currentUser.photoURL, (res) => {
				setStatus(res);
			});
		}, 1000);
	}, [currentUser.photoURL]);

	if (status) {
		clearInterval(interval.current);
	}

	return <Avatar alt={currentUser.displayName} src={currentUser.photoURL} />;
};

const UserPanel = () => {
	const currentUser = useSelector((state) => state.user.currentUser);
	const handleSignOut = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				console.log('signed out!');
			});
	};

	// console.log(currentUser.photoURL);

	// React.useEffect(() => {
	// 	const imageExists = (image_url) => {
	// 		const http = new XMLHttpRequest();

	// 		http.open('HEAD', image_url, false);
	// 		http.send();

	// 		return http.status != 404;
	// 	};
	// 	console.log(imageExists(currentUser.photoURL));
	// }, []);
	return (
		<Wrap>
			<header>
				<ForumOutlinedIcon fontSize="large" />
				<Typography variant="h4" style={{ color: 'white' }}>
					{'<DevChat/>'}
				</Typography>
			</header>

			<TooltipCustom
				placement="bottom-start"
				arrow={false}
				items={
					<>
						<Button>Change avatar</Button>
						<Button onClick={handleSignOut} endIcon={<ExitToAppIcon />}>
							Sign Out
						</Button>
					</>
				}
			>
				<Box display="flex" flexGrow={0} margin="auto">
					{/* <Avatar
						alt={currentUser.displayName}
						src={currentUser.photoURL}
					/> */}
					{AvatarReloaded(currentUser)}
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
