import {
  firebasedb,
} from '../../scripts/util/setupFirebase';

const setUser = payload => ({
  payload,
  type: 'SET_USER',
});

const setMOCs = payload => ({
  payload,
  type: 'SET_MOCS',
});

export const writeUserData = payload => (dispatch) => {
  firebasedb.ref(`users/${payload.uid}`).update({
    email: payload.email,
    username: payload.displayName,
  })
    .then(dispatch(setUser(payload)));
};

export const getUserMOCs = payload => (dispatch) => {
  firebasedb.ref(`users/${payload.uid}/mocs`).once('value').then((snapshot) => {
    const mocIds = Object.keys(snapshot.val());
    dispatch(setMOCs(mocIds))
  })
}