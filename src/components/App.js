import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MAIN_SHOW_INTRO } from 'types/mainTypes';
import { setUser, clearUser } from 'actions/userActions';
import { Switch, Route, useHistory } from 'react-router-dom';
import ChatScreen from 'components/screens/ChatScreen';
import AuthScreen from 'components/screens/AuthScreen';
import { Background, SnackBarCustom } from 'components/common';
import firebase from 'config/firebase';

const App = () => {
	const history = useHistory();
	const dispatch = useDispatch();
	const showIntro = useSelector((state) => state.introAnimation.showIntro);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			dispatch({ type: MAIN_SHOW_INTRO });
			clearTimeout(timeout);
		}, 4400);
	}, [dispatch]);

	React.useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				dispatch(setUser(user));
				history.push('/');
			} else if (!showIntro) {
				history.push('/auth/login');
				dispatch(clearUser());
			}
		});
	}, [dispatch, history, showIntro]);

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
