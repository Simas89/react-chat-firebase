import React from 'react';
import firebase from 'config/firebase';
import { useSelector } from 'react-redux';
import {
	Box,
	Button,
	Avatar,
	Grid,
	Typography,
	ClickAwayListener,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import styled from 'styled-components';
import { TooltipCustom, ModalAvatar } from 'components/common';

const Wrap = styled.div`
	width: 350px;

	header {
		display: flex;
		font-family: 'Hiddencocktails' !important;
		font-size: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		span {
			z-index: 10;
			user-select: none;
			background: -webkit-linear-gradient(
				${(p) => p.theme.palette.background.light},
				${(p) => p.theme.palette.background.dark}
			);
			-webkit-background-clip: text;
			background-clip: text;
			-webkit-text-fill-color: transparent;
			&:hover {
				cursor: pointer;
			}
		}
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
			if (!url.includes('firebase'))
				fetch(url, { method: 'HEAD' })
					.then((res) => {
						if (res.ok) {
							cb(true);
						} else {
							cb(true);
						}
					})
					.catch(() => {});
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

	return (
		<Avatar
			style={{ height: '80px', width: '80px' }}
			alt={currentUser.displayName}
			src={currentUser.photoURL}
		/>
	);
};

const UserPanel = () => {
	const [isModal, setIsModal] = React.useState(false);
	const currentUser = useSelector((state) => state.user.currentUser);
	const [openTooltip, setOpenTooltip] = React.useState(false);

	const handleTooltipClose = () => {
		setOpenTooltip(false);
	};

	const handleTooltipOpen = () => {
		setOpenTooltip(true);
	};

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
			{isModal && <ModalAvatar setIsModal={setIsModal} />}
			<header>
				<span className="pimpirim">PimPirim</span>
			</header>

			<Grid container>
				<Grid item>
					<ClickAwayListener onClickAway={handleTooltipClose}>
						<div>
							<TooltipCustom
								onClose={handleTooltipClose}
								isOpen={openTooltip}
								placement="bottom-start"
								arrow={false}
								items={
									<>
										<Button onClick={() => setIsModal(true)}>
											Change avatar
										</Button>
										<Button
											onClick={handleSignOut}
											endIcon={<ExitToAppIcon />}
										>
											Sign Out
										</Button>
									</>
								}
							>
								<Box
									display="flex"
									margin="auto"
									alignItems="flex-end"
									style={{ marginRight: 'auto' }}
								>
									{AvatarReloaded(currentUser)}
									<Button
										style={{
											color: 'black',
											height: '25px',
										}}
										disableElevation
										disableRipple
									>
										<Typography
											onClick={
												openTooltip
													? handleTooltipClose
													: handleTooltipOpen
											}
											variant="h6"
											color="textPrimary"
										>
											{currentUser.displayName}
										</Typography>
										<span
											style={{
												fontSize: '.5rem',
												marginLeft: '5px',
												color: 'rgba(0,0,0,86)',
											}}
										>
											▼
										</span>
									</Button>
								</Box>
							</TooltipCustom>
						</div>
					</ClickAwayListener>
				</Grid>
			</Grid>
		</Wrap>
	);
};

export default UserPanel;
