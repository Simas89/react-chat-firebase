import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Grid, Container, Paper, useMediaQuery } from '@material-ui/core';
import { Route } from 'react-router-dom';
import LoginForm from 'components/Auth/LoginForm';
import RegisterForm from 'components/Auth/RegisterForm';
import { motion } from 'framer-motion';
import RegisterWithGoogle from 'components/Auth/RegisterWithGoogle';

// import firebase from 'config/firebase';

const Wrap = styled.div`
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	.pimpirim {
		font-family: 'Hiddencocktails' !important;
		font-size: 6rem;
		/* border: 1px solid red; */
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		span {
			user-select: none;
		}
	}

	.paper {
		background-color: ${(p) => p.theme.palette.white};
		display: flex;
		padding: 40px;
		${(props) => props.theme.breakpoints.down('md')} {
			padding: 18px;
		}

		width: 100%;
	}
	form {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-around;
		gap: 26px;

		.MuiFormHelperText-root {
			position: absolute;
			bottom: -20px;
		}
		.btn {
			width: 120px;
			margin-right: 10px;
		}
	}
`;
// const usersRef = firebase.database().ref('users');

const MotionPaper = motion.custom(Paper);

const AuthScreen = ({ location }) => {
	const [page, setPage] = React.useState(location.pathname.split('/')[2]);
	const showIntro = useSelector((state) => state.animations.showIntro);
	const smallScreen = useMediaQuery('(max-width:600px)');

	React.useEffect(() => {
		setPage(location.pathname.split('/')[2]);
	}, [location]);

	const motionPaperVariants = {
		high: {
			height: smallScreen ? 360 : 480,
			transition: {
				type: 'spring',
				stiffness: 1300,
				mass: 2,
				damping: 55,
			},
		},
		low: {
			height: smallScreen ? 220 : 312,
			transition: {
				type: 'spring',
				stiffness: 1300,
				mass: 2,
				damping: 55,
			},
		},
		fadeIn: {
			opacity: 1,
			transition: { type: 'tween', duration: 0.6, delay: 0.8 },
		},
		pimPirim: {
			y: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				stiffness: 400,
				mass: 2,
				damping: 35,
				restSpeed: 0.001,
				restDelta: 0.001,
				delay: 0.3,
			},
		},
	};

	return (
		!showIntro && (
			<Wrap>
				<Container maxWidth="sm">
					<motion.div
						variants={motionPaperVariants}
						className="pimpirim"
						initial={{ y: -800, opacity: 0 }}
						animate="pimPirim"
						// transition={{
						// 	type: 'spring',
						// 	mass: 2,
						// 	stiffness: 200,
						// 	damping: 20,
						// }}
					>
						<span>PimPirim</span>
					</motion.div>
					<Grid container justify="center">
						<motion.div
							variants={motionPaperVariants}
							initial={{ opacity: 0 }}
							animate={!showIntro && 'fadeIn'}
							style={{ width: '100%' }}
						>
							<MotionPaper
								className="paper"
								elevation={20}
								style={{ width: '100%' }}
								variants={motionPaperVariants}
								animate={page === 'register' ? 'high' : 'low'}
							>
								<Grid item xs={12}>
									<Route path="/auth/login" component={LoginForm} />
									<Route
										path="/auth/register"
										component={RegisterForm}
									/>
								</Grid>
							</MotionPaper>
							<RegisterWithGoogle />
						</motion.div>
					</Grid>
				</Container>
			</Wrap>
		)
	);
};

export default AuthScreen;
