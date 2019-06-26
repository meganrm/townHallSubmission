
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import {
  firebase,
  firebaseauth,
} from './scripts/util/setupFirebase';

import { showUserEvents } from './scripts/views/newEventView';
import './scripts/controllers/routes';
import {
  writeUserData,
  startSetUserMocs
} from './state/user/actions';

import './vendor/styles/normalize.css';
import './styles/customboot.less';
import App from './containers/App';

import store from './store/configureStore';

const provider = new firebase.auth.GoogleAuthProvider();

const jsx = (
  <Provider store={store}>
    <App />
  </Provider>
);

const renderApp = () => {
  ReactDom.render(jsx, document.getElementById('root'));
};

renderApp();

const signIn = () => {
  firebaseauth.signInWithRedirect(provider);
  firebaseauth.getRedirectResult().then(() => {
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
};

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(startSetUserMocs(user))
    // User is signed in.
    console.log(user.displayName, ' is signed in');
    // eventHandler.readData();
    showUserEvents();

    store.dispatch(writeUserData(user));
  } else {
    signIn();
    // No user is signed in.
  }
});
