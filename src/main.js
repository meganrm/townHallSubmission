
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { Alert } from 'antd';
import {
  firebase,
  firebaseauth,
  firebasedb,
} from './scripts/util/setupFirebase';

import './scripts/controllers/routes';
import {
  writeUserData,
  incrementUserEventCount,
  setInitialCount,
} from './state/user/actions';

import './vendor/styles/normalize.css';
import './styles/customboot.less';
import App from './containers/App';

import store from './store/configureStore';
import { getIsInitial } from './state/user/selectors';

const provider = new firebase.auth.GoogleAuthProvider();
const redirectMessaging = (
  <Alert
    message="This is no longer a working url"
    description={[<div>Please use this link, and bookmark it:</div>, (<a href="https://townhallsubmission.herokuapp.com/">Submission Form</a>)]}
    type="success"
  />);

const jsx = window.location.href === 'https://townhallsubmission-state.herokuapp.com/' ? redirectMessaging : (
  <Provider store={store}>
    <App />
  </Provider>);

const renderApp = () => {
  ReactDom.render(jsx, document.getElementById('root'));
};

const signIn = () => {
  firebaseauth.signInWithPopup(provider);
};

firebaseauth.onAuthStateChanged((user) => {
  if (user) {
    alert("Signed in")
    // User is signed in.
    renderApp();

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
    alert("Not signed in")
    signIn();
    // No user is signed in.
  }
});
