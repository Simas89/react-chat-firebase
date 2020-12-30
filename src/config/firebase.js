import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyBOidaBsU8NzErxXfjA0276T44jjP9oaSM',
	authDomain: 'react-chat-8590f.firebaseapp.com',
	databaseURL:
		'https://react-chat-8590f-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'react-chat-8590f',
	storageBucket: 'react-chat-8590f.appspot.com',
	messagingSenderId: '456757375696',
	appId: '1:456757375696:web:cc3da1ca0313cd2c0924d5',
	measurementId: 'G-Z2SY9W5RBF',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default firebase;
