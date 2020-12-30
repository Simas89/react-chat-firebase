import React from 'react';
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
import StyledLink from 'components/common/StyledLink';

import firebase from 'config/firebase';
import md5 from 'md5';

const usersRef = firebase.database().ref('users');

const RegisterForm = () => {
	const [name, setName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [password2, setPassword2] = React.useState('');
	const [showPassword, setShowPassword] = React.useState(false);
	const [showPassword2, setShowPassword2] = React.useState(false);
	const [isNameError, setIsNameError] = React.useState(false);
	const [isNameTooLong, setIsNameTooLong] = React.useState(false);
	const [isEmailError, setIsEmailError] = React.useState(false);
	const [isPasswordError, setIsPasswordError] = React.useState(false);
	const [isPassword2Error, setIsPassword2Error] = React.useState(false);
	const [serverError, setServerError] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	// const [usersRef, setUsersRef] = React.useState(
	// 	firebase.database().ref('users')
	// );

	const nameMin = 3;
	const nameMax = 15;
	const pswMin = 6;

	React.useEffect(() => {
		setIsNameError(false);
		if (name.length === nameMax) {
			setIsNameTooLong(true);
		} else setIsNameTooLong(false);
	}, [name]);

	React.useEffect(() => {
		setIsEmailError(false);
	}, [email]);

	React.useEffect(() => {
		setIsPasswordError(false);
	}, [password]);

	React.useEffect(() => {
		setIsPassword2Error(false);
	}, [password, password2]);

	const submitHandler = (e) => {
		e.preventDefault();
		let pass = true;

		if (name.length < nameMin - 1 && pass) {
			setIsNameError(true);
			pass = false;
		}

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

		if (password !== password2 && pass) {
			setIsPassword2Error(true);
			pass = false;
		}

		if (pass) {
			setLoading(true);
			firebase
				.auth()
				.createUserWithEmailAndPassword(email, password)
				.then((newUser) => {
					newUser.user
						.updateProfile({
							displayName: name,
							photoURL: `https://gravatar.com/avatar/${md5(
								newUser.user.email
							)}?d=identicon`,
						})
						.then(() => {
							setLoading(false);

							saveUser(newUser).then((id) => console.log('USER SAVED!'));
						})
						.catch((err) => {
							setServerError(err.message);
							setLoading(false);
						});
				})
				.catch((err) => {
					setServerError(err.message);
					setLoading(false);
				});
		}
	};

	const saveUser = async (createdUser) => {
		return await usersRef.child(createdUser.user.uid).set({
			name: createdUser.user.displayName,
			avatar: createdUser.user.photoURL,
		});
	};

	return (
		<form onSubmit={submitHandler}>
			<TextField
				onChange={(e) => {
					if (
						e.target.value.match(/^(?!\s)[a-zA-Z0-9]*$/) &&
						e.target.value.length <= nameMax
					)
						setName(e.target.value);
				}}
				value={name}
				style={{ width: '100%' }}
				variant="outlined"
				required
				type="name"
				id="name"
				label="User name"
				error={isNameError}
				helperText={
					isNameError
						? `User name should be at least ${nameMin} characters`
						: isNameTooLong &&
						  `User name should be no longer than ${nameMin} characters `
				}
			/>
			<TextField
				onChange={(e) => {
					if (e.target.value.match(/^(?!\s)[a-zA-Z0-9-@.]*$/))
						setEmail(e.target.value);
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

			<TextField
				onChange={(e) => {
					if (
						e.target.value.match(
							/^(?!\s)[a-zA-Z0-9-!"#$%&'()*+,-./:;<=>?[\]`{|}~_]*$/
						)
					)
						setPassword2(e.target.value);
				}}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={() => setShowPassword2(!showPassword2)}
								//   onMouseDown={handleMouseDownPassword}
							>
								{showPassword2 ? <Visibility /> : <VisibilityOff />}
							</IconButton>
						</InputAdornment>
					),
				}}
				value={password2}
				style={{ width: '100%' }}
				variant="outlined"
				required
				type={showPassword2 ? 'text' : 'password'}
				id="password-confirm"
				label="Confirm password"
				error={isPassword2Error}
				helperText={isPassword2Error && 'Passwords do not match'}
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
					Register
					{loading && (
						<CircularProgress
							size={30}
							style={{ position: 'absolute' }}
						/>
					)}
				</Button>
				<Typography>
					Already a user?{' '}
					<StyledLink to="/auth/login">
						<strong>Login</strong>
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
		</form>
	);
};

export default RegisterForm;
