import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Main from 'components/Main';
import AuthScreen from 'components/screens/AuthScreen';

const App = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Main} />
				<Route path="/auth" component={AuthScreen} />
			</Switch>
		</BrowserRouter>
	);
};

export default App;
