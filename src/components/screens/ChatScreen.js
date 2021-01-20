import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNewMessages } from 'actions/channelActions';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Grid, Container } from '@material-ui/core';
import { Loader } from 'components/common';
import firebase from 'config/firebase';

import SidePanel from 'components/SidePanel/SidePanel';
import Messages from 'components/Messages/Messages';

const Wrap = styled.div`
	/* border: 1px solid red; */
	height: 100vh;
	display: grid;
	.MuiContainer-root {
		display: flex;
	}
	.loader-box {
		height: 100vh;
	}
	.motion {
		z-index: 2;
		height: 100vh;
	}
`;

const usersRef = firebase.database().ref('users');

const ChatScreen = () => {
	const isLoading = useSelector((state) => state.user.isLoading);
	const currentUser = useSelector((state) => state.user.currentUser);
	const dispatch = useDispatch();

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

	return (
		<Wrap>
			{isLoading ? (
				<div className="loader-box">
					{' '}
					<Loader />
				</div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					<Container maxWidth="xl" disableGutters>
						<motion.div className="motion">
							<SidePanel />
						</motion.div>

						<Grid container>
							<Grid item xs={12}>
								<Messages />
							</Grid>
						</Grid>
					</Container>
				</motion.div>
			)}
		</Wrap>
	);
};

export default ChatScreen;
