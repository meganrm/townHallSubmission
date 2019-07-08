
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import {
  firebase,
  firebaseauth,
  firebasedb,
} from './scripts/util/setupFirebase';

import './scripts/controllers/routes';
import {
  writeUserData,
  startSetUserMocs,
  incrementUserEventCount,
  setInitialCount,
} from './state/user/actions';

import './vendor/styles/normalize.css';
import './styles/customboot.less';
import App from './containers/App';

import store from './store/configureStore';
import { getIsInitial } from './state/user/selectors';

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
    firebasedb.ref(`users/${user.uid}/events`).once('value')
      .then((snapshot) => {
        const count = snapshot.numChildren();
        store.dispatch(setInitialCount(count));
      });

    firebasedb.ref(`users/${user.uid}/events`).on('child_added', () => {
      const state = store.getState();
      const initial = getIsInitial(state);
      if (!initial) {
        store.dispatch(incrementUserEventCount());
      }
    });
    store.dispatch(writeUserData(user));
  } else {
    signIn();
    // No user is signed in.
  }
});
