import {
  firebasedb,
} from '../../scripts/util/setupFirebase';

const setUser = payload => ({
  payload,
  type: 'SET_USER',
});

export const writeUserData = payload => (dispatch) => {
  firebasedb.ref(`users/${payload.uid}`).update({
    email: payload.email,
    username: payload.displayName,
  })
    .then(dispatch(setUser(payload)));
};
