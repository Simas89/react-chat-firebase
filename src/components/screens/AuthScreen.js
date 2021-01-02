import React from 'react';
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
		transition: { type: 'spring', stiffness: 500, mass: 2, damping: 40 },
	},
	low: {
		height: 300,
		transition: { type: 'spring', stiffness: 500, mass: 2, damping: 40 },
	},
};

const AuthScreen = ({ location }) => {
	const [page, setPage] = React.useState(location.pathname.split('/')[2]);

	React.useEffect(() => {
		setPage(location.pathname.split('/')[2]);
	}, [location]);
	return (
		<Wrap>
			<Container maxWidth="sm">
				<Grid container justify="center">
					<motion.div
						style={{ width: '100%' }}
						drag
						dragConstraints={{
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
						}}
						dragElastic={0.1}
						variants={motionPaperVariants}
						animate={page === 'register' ? 'high' : 'low'}
						elevation={7}
					>
						<Paper className="paper" elevation={10}>
							<Grid item xs={12}>
								<Route path="/auth/login" component={LoginForm} />
								<Route path="/auth/register" component={RegisterForm} />
							</Grid>
						</Paper>
					</motion.div>
				</Grid>
			</Container>
		</Wrap>
	);
};

export default AuthScreen;
