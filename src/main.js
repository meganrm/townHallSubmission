
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import {
  firebase,
  firebasedb,
  firebaseauth,
} from './scripts/util/setupFirebase';

import newEventView from './scripts/views/newEventView';
import './scripts/views/memberUpdatingView';
import './scripts/controllers/routes';
import {
  writeUserData,
} from './state/user/actions';

import './vendor/styles/normalize.css';
import './styles/customboot.less';
import App from './containers/App';

import configureStore from './store/configureStore';

const provider = new firebase.auth.GoogleAuthProvider();
const store = configureStore();

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
    // User is signed in.
    console.log(user.displayName, ' is signed in');
    // eventHandler.readData();
    newEventView.showUserEvents();

    store.dispatch(writeUserData(user));
  } else {
    signIn();
    // No user is signed in.
  }
});
