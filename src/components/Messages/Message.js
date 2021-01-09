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
		position: relative;
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
	.image-card {
		overflow: hidden;
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 5px;
		min-width: 200px;
		max-width: 100%;

		img {
			width: 100%;
			background-position: center;
			background-size: cover;
			margin-bottom: -6px;
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
				{message.image && (
					<div className="image-card">
						<img
							src={message.image}
							alt={'uploadedimg' + message.user.name}
						></img>
					</div>
				)}
			</div>
		</Wrap>
	);
};

export default Message;
