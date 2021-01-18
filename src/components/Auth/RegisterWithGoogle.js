import React from 'react';
import firebase from 'config/firebase';
import md5 from 'md5';
import GoogleButton from 'react-google-button';

const usersRef = firebase.database().ref('users');
var googleProvider = new firebase.auth.GoogleAuthProvider();

const RegisterWithGoogle = () => {
	React.useEffect(() => {}, []);
	const handleClick = () => {
		firebase
			.auth()
			.signInWithPopup(googleProvider)
			.then((newUser) => {
				newUser.user
					.updateProfile({
						photoURL: `https://gravatar.com/avatar/${md5(
							newUser.user.displayName
						)}?d=robohash`,
					})
					.then(() => {
						saveUser(newUser).then(() => console.log('USER SAVED!'));
					})
					.catch((err) => {
						console.log(err);
					});
			});
	};
	const saveUser = async (createdUser) => {
		return await usersRef.child(createdUser.user.uid).set({
			name: createdUser.user.displayName,
			avatar: createdUser.user.photoURL,
		});
	};
	return (
		<GoogleButton
			onClick={handleClick}
			style={{
				width: '100%',
				marginTop: '24px',
				backgroundColor: '#FAFAFA',
			}}
			type="light" // can be light or dark
		/>
	);
};

export default RegisterWithGoogle;
