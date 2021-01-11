import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import MessagesHeader from 'components/Messages/MessagesHeader';
import MessageForm from 'components/Messages/MessageForm';
import MessagesContent from 'components/Messages/MessagesContent';
import { Grid } from '@material-ui/core';
import firebase from 'config/firebase';

const Wrap = styled.div`
	margin-right: 8px;
	padding: 10px 20px 0 20px;
	height: 100%;
	background-color: ${(p) => p.theme.palette.white};
	.container {
		height: 100%;
	}
`;

const messagesRef = firebase.database().ref('messages');

let prev = '';
const Messages = () => {
	const [messages, setMessages] = React.useState([]);
	const [messagesFiltered, setMessagesFiltered] = React.useState([]);
	const [searchTerm, setSearchTerm] = React.useState('');
	const currentChannel = useSelector((state) => state.channel.currentChannel);
	const currentUser = useSelector((state) => state.user.currentUser);

	React.useEffect(() => {
		setMessages([]);
		// messagesRef.off();
	}, [currentChannel]);

	React.useEffect(() => {
		const addListeners = (channelId) => {
			messagesRef.child(channelId).on('value', function (snap) {
				snap.val() && setMessages(parseObjToArray(snap.val()));
				messagesRef.child(channelId).off('value');
			});
			messagesRef.child(channelId).on('child_changed', function (snap) {
				setMessages((prevState) => [...prevState, snap.val()]);
			});

			prev && messagesRef.child(prev).off();
			prev = channelId;
		};

		if (currentUser && currentChannel) {
			addListeners(currentChannel.id);
		}
	}, [currentUser, currentChannel]);

	const parseObjToArray = (obj) => {
		let parsedMessages = [];
		for (const [key, value] of Object.entries(obj)) {
			parsedMessages.push({ ...value });
		}
		return parsedMessages;
	};

	React.useEffect(() => {
		const channelMessages = [...messages];
		const regex = new RegExp(searchTerm, 'gi');
		const searchResults = channelMessages.reduce((acc, message) => {
			if (
				(message.content && message.content.match(regex)) ||
				message.user.name.match(regex)
			) {
				acc.push(message);
			}
			return acc;
		}, []);
		setMessagesFiltered(searchResults);
	}, [searchTerm, messages]);

	const countUniqueUsers = () => {
		const uniqueUsers = messages.reduce((acc, el) => {
			if (!acc.includes(el.user.name)) {
				acc.push(el.user.name);
			}
			return acc;
		}, []);

		return uniqueUsers;
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

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
					<MessagesHeader
						messagesRef={messagesRef}
						uniqueUsers={countUniqueUsers()}
						handleSearchChange={handleSearchChange}
					/>
				</Grid>
				<Grid item style={{ flexGrow: 1 }}>
					<MessagesContent
						messages={searchTerm ? messagesFiltered : messages}
					/>
				</Grid>
				<Grid item>
					<MessageForm messagesRef={messagesRef} />
				</Grid>
			</Grid>
		</Wrap>
	);
};

export default Messages;
