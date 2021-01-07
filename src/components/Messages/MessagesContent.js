import React from 'react';
import { useSelector } from 'react-redux';
import { Paper } from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';
import styled from 'styled-components';
import Message from 'components/Messages/Message';

const Wrap = styled(Paper)`
	height: 100%;
	padding: 0 10px;
	background-color: white;

	.scroll-bars {
		/* border: 1px solid red; */
	}
`;

const MessagesContent = ({ messagesRef }) => {
	const [messages, setMessages] = React.useState([]);
	// const [loading, setLoading] = React.useState(false);
	const currentChannel = useSelector((state) => state.channel.currentChannel);
	const currentUser = useSelector((state) => state.user.currentUser);

	React.useEffect(() => {
		setMessages([]);
	}, [currentChannel]);

	React.useEffect(() => {
		const addListeners = (channelId) => {
			messagesRef.child(channelId).on('child_added', (snap) => {
				setMessages((prevState) => [...prevState, snap.val()]);
			});
		};

		if (currentUser && currentChannel) {
			addListeners(currentChannel.id);
		}
	}, [currentUser, currentChannel, messagesRef]);

	// console.log(messages);

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
