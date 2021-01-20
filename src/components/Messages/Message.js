import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Avatar, Box, Typography } from '@material-ui/core';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { Skeleton } from '@material-ui/lab';
import firebase from 'config/firebase';

const StyledDiv = styled.div`
	/* border: 1px solid red; */
	position: relative;
	border-radius: 3px;
	margin: 4px 10px 4px 0;
	padding: 10px;
	display: flex;

	${(p) =>
		p.isOwnMessage &&
		css`
			background-color: rgba(3, 169, 244, 0.1);
		`}

	.motionas {
		position: relative;
		display: flex;
		/* border: 1px solid red; */
		flex-shrink: 1;
	}
	.right {
		/* width: 100%; */
		position: relative;
		padding-left: 10px;
		.meta {
			display: flex;
			align-items: center;
			/* justify-content: center; */

			gap: 8px;
			/* border: 1px solid black; */
			.name {
				font-size: 1rem;
			}
			.gray {
				color: gray;
			}
		}
		.text {
			border: 1px solid gray;
		}
	}
	.image-card {
		/* position: relative; */
		margin-top: 6px;
		overflow: hidden;
		border: 1px solid rgba(0, 0, 0, 0.2);
		border-radius: 3px;
		min-width: 200px;

		max-width: calc(100% - 50px);

		img {
			max-width: 100%;
			background-position: center;
			background-size: cover;
			margin-bottom: -6px;
		}
	}
`;

const usersRef = firebase.database().ref('users');

const Message = ({ currentUser, message, triggerScrollDown }) => {
	const [isImageLoaded, setIsImageLoaded] = React.useState(false);
	const [avatarURL, setAvatarURL] = React.useState('');
	const animateMessage = useSelector(
		(state) => state.animations.animateMessage
	);

	React.useEffect(() => {
		usersRef
			.child(message.user.id)
			.on('value', (snap) => setAvatarURL(snap.val().avatar));

		return () => usersRef.child(message.user.id).off('value');
	}, [message.user.id]);
	const messageAppearVariant = {
		initial: {
			opacity: 0,
			scale: 0.5,
			// y: 50,
		},
		animate: {
			opacity: 1,
			scale: 1,
			// y: 0,
			transition: {
				type: 'spring',
				stiffness: 320,
				mass: 1,
				damping: 20,

				velocity: 0,
				restDelta: 0.001,
				restSpeed: 0.001,
			},
		},
	};

	return (
		<StyledDiv isOwnMessage={currentUser.displayName === message.user.name}>
			<motion.div
				className="motionas"
				variants={animateMessage && messageAppearVariant}
				initial="initial"
				animate="animate"
			>
				<Avatar src={avatarURL} alt={message.user.name} />
				<div className="right">
					<div className="meta">
						<span className="name">
							<b>{message.user.name}</b>
						</span>
						<span className="gray">•</span>
						<span className="gray">
							{moment(message.timestamp).fromNow()}
						</span>
					</div>

					<Typography variant="body1" color="textPrimary">
						{message.content}
					</Typography>
					{message.image && (
						<div className={'image-card'}>
							{!isImageLoaded && (
								<Skeleton
									animation="wave"
									variant="rect"
									width={message.image.imgSize.width}
									height={message.image.imgSize.height}
								/>
							)}
							<img
								style={{ display: 'block' }}
								src={message.image.fileUrl}
								alt={'uploadedimg' + message.user.name}
								onLoad={() => {
									setIsImageLoaded(true);
									triggerScrollDown();
								}}
							></img>
							{message.image.caption && (
								<Box padding={1} marginTop={1}>
									<Typography variant="body2" color="textSecondary">
										{message.image.caption}
									</Typography>
								</Box>
							)}
						</div>
					)}
				</div>
			</motion.div>
		</StyledDiv>
	);
};

export default Message;
