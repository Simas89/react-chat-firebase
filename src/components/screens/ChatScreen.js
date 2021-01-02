import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Grid, Container, Box } from '@material-ui/core';
import { Loader } from 'components/common';

import SidePanel from 'components/SidePanel/SidePanel';
import Messages from 'components/Messages/Messages';
import MetaPanel from 'components/MetaPanel/MetaPanel';
import ColorPanel from 'components/ColorPanel/ColorPanel';

const Wrap = styled.div`
	/* border: 1px solid red; */
	height: 100vh;
	display: grid;
	.loader-box {
		height: 100vh;
	}
	.motion {
		height: 100vh;
	}
`;

const ChatScreen = () => {
	const isLoading = useSelector((state) => state.user.isLoading);

	// console.log(isLoading);
	return (
		<Wrap>
			{isLoading ? (
				<div className="loader-box">
					<Loader />
				</div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					<Container maxWidth="xl">
						<Grid container>
							<Grid item xs={2}>
								<motion.div className="motion">
									<SidePanel />
								</motion.div>
							</Grid>

							<Grid item xs={2}>
								<ColorPanel />
							</Grid>

							<Grid item xs={4}>
								<Messages />
							</Grid>
							<Grid item xs={4}>
								<MetaPanel />
							</Grid>
						</Grid>
					</Container>
				</motion.div>
			)}
		</Wrap>
	);
};

export default ChatScreen;
