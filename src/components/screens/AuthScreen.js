import React from 'react';
import styled from 'styled-components';
import { Grid, Container, Paper } from '@material-ui/core';
import { Route } from 'react-router-dom';
import LoginForm from 'components/Auth/LoginForm';
import RegisterForm from 'components/Auth/RegisterForm';

// import firebase from 'config/firebase';

const Wrap = styled.div`
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;

	.paper {
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

const AuthScreen = () => {
	return (
		<Wrap>
			<Container maxWidth="sm">
				<Grid container justify="center">
					<Paper className="paper" elevation={7}>
						<Grid item xs={12}>
							<Route path="/auth/login" component={LoginForm} />
							<Route path="/auth/register" component={RegisterForm} />
						</Grid>
					</Paper>
				</Grid>
			</Container>
		</Wrap>
	);
};

export default AuthScreen;
