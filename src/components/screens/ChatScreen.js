import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNewMessages } from 'actions/channelActions';
import { SET_SWIPED_SCREEN } from 'types/mainTypes';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Grid, Container, useMediaQuery } from '@material-ui/core';
import { Loader } from 'components/common';
import firebase from 'config/firebase';

import { useSwipeable } from 'react-swipeable';

import SidePanel from 'components/SidePanel/SidePanel';
import Messages from 'components/Messages/Messages';

const Wrap = styled.div`
	scroll-behavior: smooth;
	height: 100vh;
	display: grid;
	overflow-y: hidden;
	.MuiContainer-root {
		display: flex;
	}
	.loader-box {
		height: 100vh;
	}
	.side-panel {
		z-index: 2;
		height: 100vh;
		/* border: 1px solid red; */
	}
`;

const usersRef = firebase.database().ref('users');

const MotionContainer = motion.custom(Container);

const ChatScreen = () => {
	const isLoading = useSelector((state) => state.user.isLoading);
	const currentUser = useSelector((state) => state.user.currentUser);
	const swipedScreen = useSelector((state) => state.animations.swipedScreen);
	const { direction, deltaX } = swipedScreen;
	const dispatch = useDispatch();
	const smallScreen = useMediaQuery('(max-width:600px)');

	const config = { preventDefaultTouchmoveEvent: false, trackMouse: false };
	const handlers = useSwipeable({
		onSwipedRight: (e) => {
			dispatch({
				type: SET_SWIPED_SCREEN,
				payload: { direction: 'LEFT', deltaX: Math.round(e.deltaX) },
			});
		},
		onSwipedLeft: (e) => {
			dispatch({
				type: SET_SWIPED_SCREEN,
				payload: { direction: 'RIGHT', deltaX: Math.round(e.deltaX) },
			});
		},
		...config,
	});

	React.useEffect(() => {
		if (currentUser) {
			usersRef
				.child(currentUser.uid)
				.child('newMessages')
				.on('value', (snap) => {
					dispatch(setNewMessages(snap.val()));
				});
		}
	}, [currentUser, dispatch]);

	const ref = React.useRef(null);

	React.useEffect(() => {
		if (ref.current) {
			console.log(ref);
			console.log(ref.current.scrollRight);
			ref.current.scrollLeft = -200;
		}
	}, [ref.current]);

	const scroll = (scrollOffset) => {
		ref.current.scrollLeft = scrollOffset;
	};

	return (
		<Wrap {...handlers} onClick={() => scroll(200)} ref={ref}>
			{isLoading ? (
				<div className="loader-box">
					<Loader />
				</div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					// drag="x"
					// dragConstraints={{ left: 0, right: 0 }}
				>
					<MotionContainer
						maxWidth="xl"
						disableGutters
						initial={{ x: 0 }}
						// animate={{
						// 	x: direction === 'LEFT' ? 0 : `calc(-50% - ${deltaX}px)`,
						// }}
						transition={{ type: 'tween' }}
					>
						<motion.div
							className="side-panel"
							style={{ width: smallScreen ? '100vw' : '350px' }}
						>
							<SidePanel />
						</motion.div>

						<Grid
							container
							style={{ width: smallScreen ? '100vw' : '100%' }}
						>
							<Grid item xs={12}>
								<Messages />
							</Grid>
						</Grid>
					</MotionContainer>
				</motion.div>
			)}
		</Wrap>
	);
};

export default ChatScreen;
