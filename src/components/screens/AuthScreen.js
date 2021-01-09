import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Grid, Container, Paper } from '@material-ui/core';
import { Route } from 'react-router-dom';
import LoginForm from 'components/Auth/LoginForm';
import RegisterForm from 'components/Auth/RegisterForm';
import { motion } from 'framer-motion';

// import firebase from 'config/firebase';

const Wrap = styled.div`
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;

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

const motionPaperVariants = {
	high: {
		height: 480,
		transition: { type: 'spring', stiffness: 300, mass: 2, damping: 60 },
	},
	low: {
		height: 300,
		transition: { type: 'spring', stiffness: 300, mass: 2, damping: 60 },
	},
	fadeIn: {
		opacity: 1,
		transition: { type: 'tween', duration: 0.5, delay: 0.3 },
	},
};

const AuthScreen = ({ location }) => {
	const [page, setPage] = React.useState(location.pathname.split('/')[2]);
	const showIntro = useSelector((state) => state.introAnimation.showIntro);

	React.useEffect(() => {
		setPage(location.pathname.split('/')[2]);
	}, [location]);

	return (
		!showIntro && (
			<Wrap>
				<Container maxWidth="sm">
					<Grid container justify="center">
						<motion.div
							variants={motionPaperVariants}
							initial={{ opacity: 0 }}
							animate={!showIntro && 'fadeIn'}
							style={{ width: '100%' }}
						>
							<motion.div
								style={{ width: '100%' }}
								variants={motionPaperVariants}
								animate={page === 'register' ? 'high' : 'low'}
								elevation={7}
							>
								<Paper className="paper" elevation={12}>
									<Grid item xs={12}>
										<Route path="/auth/login" component={LoginForm} />
										<Route
											path="/auth/register"
											component={RegisterForm}
										/>
									</Grid>
								</Paper>
							</motion.div>
						</motion.div>
					</Grid>
				</Container>
			</Wrap>
		)
	);
};

export default AuthScreen;
