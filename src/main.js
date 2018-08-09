import {
    firebase,
    firebasedb,
    firebaseauth,
} from './scripts/util/setupFirebase';

import newEventView from './scripts/views/newEventView';
import './scripts/views/memberUpdatingView';
import './scripts/controllers/routes';

import './vendor/styles/normalize.css';
import './styles/customboot.less';

const provider = new firebase.auth.GoogleAuthProvider();

function writeUserData(userId, name, email) {
    firebasedb.ref(`users/${userId}`).update({
        email,
        username: name,
    });
}

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
        writeUserData(user.uid, user.displayName, user.email);
    } else {
        signIn();
    // No user is signed in.
    }
});
