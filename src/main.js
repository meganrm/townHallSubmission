
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

const securityMessage = (
  <div id="content">
    <h1>Logging In</h1>
    <p>Attempting to log you in. If you're having trouble, you might need to enable pop ups
    for this page in your browser and refresh the page.</p>
  </div>
);

const renderApp = () => {
  ReactDom.render(jsx, document.getElementById('root'));
};

const renderLogInLanding = () => {
  ReactDom.render(securityMessage, document.getElementById('root'));
};
renderLogInLanding();

const signIn = () => {
  firebaseauth.signInWithPopup(provider)
    .catch((e) => {
      console.log(e);
      if (e.code === "auth/popup-blocked") {
        const warning = document.createElement("p");
        warning.innerHTML = "The browser pop-up blocker has prevented you from logging in. " +
                            "<b>Please allow pop-ups, refresh your browser, and try again</b>.";
        document.getElementById("content").appendChild(warning);
      }
    });
};

firebaseauth.onAuthStateChanged((user) => {
  if (user) {
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
    // No user is signed in.
    signIn();
  }
});
