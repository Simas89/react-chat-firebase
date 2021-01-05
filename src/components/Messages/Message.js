import React from 'react';
import moment from 'moment';
import { Avatar, Typography } from '@material-ui/core';

import styled, { css } from 'styled-components';

const Wrap = styled.div`
	/* border: 1px solid red; */
	position: relative;
	border-radius: 5px;
	margin: 10px 0;
	padding: 10px;
	display: flex;

	${(p) =>
		p.isOwnMessage &&
		css`
			background-color: rgba(3, 169, 244, 0.1);
		`}

	.right {
		padding-left: 10px;
		.meta {
			display: flex;
			align-items: flex-end;

			gap: 10px;
			/* border: 1px solid black; */
			.name {
				font-size: 1rem;
			}
			.time {
				color: gray;
			}
		}
		.text {
			border: 1px solid gray;
		}
	}
`;

const Message = ({ currentUser, message }) => {
	// console.log(message);
	return (
		<Wrap isOwnMessage={currentUser.displayName === message.user.name}>
			<Avatar src={message.user.avatar} alt={message.user.name} />
			<div className="right">
				<div className="meta">
					<span className="name">
						<strong>{message.user.name}</strong>
					</span>
					<span className="time">
						{moment(message.timestamp).fromNow()}
					</span>
				</div>

				<Typography>{message.content}</Typography>
			</div>
		</Wrap>
	);
};

export default Message;
