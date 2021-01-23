import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MAIN_UPDATE_FORM_INPUTS } from 'types/mainTypes';
import {
	Button,
	TextField,
	IconButton,
	InputAdornment,
	Box,
	Typography,
	CircularProgress,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { StyledLink } from 'components/common';
import { motion } from 'framer-motion';

import firebase from 'config/firebase';

const formVarians = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
		transition: { delay: 0.2 },
	},
};

const LoginForm = () => {
	const dispatch = useDispatch();
	const [password, setPassword] = React.useState('');
	const [showPassword, setShowPassword] = React.useState(false);
	const [isEmailError, setIsEmailError] = React.useState(false);
	const [isPasswordError, setIsPasswordError] = React.useState(false);
	const [serverError, setServerError] = React.useState('');
	const [loading, setLoading] = React.useState(false);

	const formInputs = useSelector((state) => state.formInputs);
	const { email } = formInputs;

	const pswMin = 6;

	React.useEffect(() => {
		setIsEmailError(false);
	}, [email]);

	React.useEffect(() => {
		setIsPasswordError(false);
	}, [password]);

	const submitHandler = (e) => {
		e.preventDefault();
		setServerError('');
		let pass = true;

		if (
			!RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(email) &&
			pass
		) {
			setIsEmailError(true);
			pass = false;
		}

		if (password.length < pswMin && pass) {
			setIsPasswordError(true);
			pass = false;
		}

		if (pass) {
			setLoading(true);
			firebase
				.auth()
				.signInWithEmailAndPassword(email, password)
				.then((signedInUser) => {
					console.log(signedInUser);
				})
				.catch((err) => {
					setServerError(err.message);
					setLoading(false);
				});
		}
	};

	return (
		<motion.form
			onSubmit={submitHandler}
			variants={formVarians}
			initial="hidden"
			animate="visible"
		>
			<TextField
				onChange={(e) => {
					if (e.target.value.match(/^(?!\s)[a-zA-Z0-9-@.]*$/))
						dispatch({
							type: MAIN_UPDATE_FORM_INPUTS,
							payload: { field: 'email', value: e.target.value },
						});
				}}
				value={email}
				style={{ width: '100%' }}
				variant="outlined"
				required
				type="email"
				id="email"
				label="Email"
				error={isEmailError}
				helperText={isEmailError && 'Email is not valid'}
			/>
			<TextField
				onChange={(e) => {
					if (
						e.target.value.match(
							/^(?!\s)[a-zA-Z0-9-!"#$%&'()*+,-./:;<=>?[\]`{|}~_]*$/
						)
					)
						setPassword(e.target.value);
				}}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={() => setShowPassword(!showPassword)}
								//   onMouseDown={handleMouseDownPassword}
							>
								{showPassword ? <Visibility /> : <VisibilityOff />}
							</IconButton>
						</InputAdornment>
					),
				}}
				value={password}
				style={{ width: '100%' }}
				variant="outlined"
				required
				type={showPassword ? 'text' : 'password'}
				id="password"
				label="Password"
				error={isPasswordError}
				helperText={
					isPasswordError && `Password should be at least 6 characters`
				}
			/>

			<Box
				width="100%"
				display="flex"
				justifyContent="space-between"
				alignItems="flex-end"
			>
				<Button
					className="btn"
					style={{ height: '50px' }}
					type="submit"
					variant="contained"
					color="primary"
					disabled={loading}
				>
					Login
					{loading && (
						<CircularProgress
							size={30}
							style={{ position: 'absolute' }}
						/>
					)}
				</Button>
				<Typography>
					Don't have an account?{' '}
					<StyledLink to="/auth/register">
						<strong>Register</strong>
					</StyledLink>
				</Typography>
			</Box>
			{serverError && (
				<Typography
					variant="body2"
					style={{
						color: 'red',
					}}
				>
					{serverError}
				</Typography>
			)}
		</motion.form>
	);
};

export default LoginForm;
