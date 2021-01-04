import React from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from 'actions/userActions';
import { Switch, Route, useHistory } from 'react-router-dom';
import ChatScreen from 'components/screens/ChatScreen';
import AuthScreen from 'components/screens/AuthScreen';
import { Background, SnackBarCustom } from 'components/common';
import firebase from 'config/firebase';

const App = () => {
	const history = useHistory();
	const dispatch = useDispatch();

	React.useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				dispatch(setUser(user));
				history.push('/');
			} else {
				history.push('/auth/login');
				dispatch(clearUser());
			}
		});
	}, [dispatch, history]);
	return (
		<>
			<SnackBarCustom />
			<Background />
			<Switch>
				<Route path="/" exact component={ChatScreen} />
				<Route path="/auth" component={AuthScreen} />
			</Switch>
		</>
	);
};

export default App;
