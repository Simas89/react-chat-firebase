import React from 'react';
import styled from 'styled-components';
import MessagesHeader from 'components/Messages/MessagesHeader';
import MessageForm from 'components/Messages/MessageForm';
import MessagesContent from 'components/Messages/MessagesContent';
import { Grid } from '@material-ui/core';
import firebase from 'config/firebase';

const Wrap = styled.div`
	background-color: ${(p) => p.theme.palette.white};
	/* background-color: ${(p) => p.theme.palette.primary.main}; */
	padding: 10px 20px 0 20px;
	height: 100%;

	.container {
		height: 100%;
	}
`;

const messagesRef = firebase.database().ref('messages');

const Messages = () => {
	return (
		<Wrap>
			<Grid
				container
				className="container"
				direction="column"
				spacing={2}
				wrap="nowrap"
			>
				<Grid item>
					<MessagesHeader messagesRef={messagesRef} />
				</Grid>
				<Grid item style={{ flexGrow: 1 }}>
					<MessagesContent messagesRef={messagesRef} />
				</Grid>
				<Grid item>
					<MessageForm messagesRef={messagesRef} />
				</Grid>
			</Grid>
		</Wrap>
	);
};

export default Messages;
