import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_CHAT_WINDOW_SCROLL_PX } from 'types/channelTypes';
import { Paper } from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';
import styled from 'styled-components';
import Message from 'components/Messages/Message';

const Wrap = styled(Paper)`
	height: 100%;
	padding: 0 0px 0 8px;
	background-color: white;
	white-space: pre-line;
	position: relative;

	.scroll-bars {
		max-width: 100%;
	}
`;

const MessagesContent = ({ messages }) => {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.currentUser);
	const scrollBarRef = React.useRef(null);
	const innerRef = React.useRef(null);

	const calcPxToBottom = (scrollValue) => {
		const outerHeight = scrollBarRef.current.getClientHeight();
		const innerHeight = innerRef.current.clientHeight;
		const chatScroll = innerHeight - (outerHeight + scrollValue);

		dispatch({ type: SET_CHAT_WINDOW_SCROLL_PX, payload: chatScroll });
	};

	React.useEffect(() => {
		triggerScrollDown();
	}, [messages]);

	const triggerScrollDown = () => {
		scrollBarRef.current.scrollToBottom({ behavior: 'smooth' });
	};

	const displayMessages = (messages) => {
		if (messages.length > 0) {
			return messages.map((el) => (
				<Message
					key={el.timestamp}
					message={el}
					currentUser={currentUser}
					triggerScrollDown={triggerScrollDown}
				/>
			));
		}
	};

	return (
		<Wrap elevation={8}>
			<Scrollbars
				className="scroll-bars"
				onScroll={(val) => calcPxToBottom(val.target.scrollTop)}
				universal={true}
				ref={scrollBarRef}
			>
				<div ref={innerRef}>{displayMessages(messages)}</div>
			</Scrollbars>
		</Wrap>
	);
};

export default MessagesContent;
