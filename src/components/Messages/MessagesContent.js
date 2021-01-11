import React from 'react';
import { useSelector } from 'react-redux';
import { Paper } from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';
import styled from 'styled-components';
import Message from 'components/Messages/Message';

const Wrap = styled(Paper)`
	height: 100%;
	padding: 0 0px 0 8px;
	background-color: white;

	.scroll-bars {
		/* div:nth-child(2) {
			border: 1px solid red;
			padding-right: 10px !important;
		} */
		/* padding: 50px !important; */
	}
`;

const MessagesContent = ({ messages }) => {
	const currentUser = useSelector((state) => state.user.currentUser);

	const displayMessages = (messages) => {
		if (messages.length > 0) {
			return messages.map((el) => (
				<Message
					key={el.timestamp}
					message={el}
					currentUser={currentUser}
				/>
			));
		}
	};

	return (
		<Wrap elevation={8}>
			<Scrollbars className="scroll-bars">
				{displayMessages(messages)}
			</Scrollbars>
		</Wrap>
	);
};

export default MessagesContent;
