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

export const incrementUserEventCount = () => ({
  type: 'INCREMENT_USER_EVENT_COUNT',
});

export const setInitialCount = count => ({
  payload: count,
  type: 'SET_INITIAL_EVENT_COUNT',
});

export const writeUserData = payload => (dispatch) => {
  firebasedb.ref(`users/${payload.uid}`).update({
    email: payload.email,
    username: payload.displayName,
  })
    .then(dispatch(setUser(payload)));
};

// TODO: FIX - if no mocs
export const startSetUserMocs = payload => (dispatch) => {
  firebasedb.ref(`users/${payload.uid}/mocs`).once('value').then((snapshot) => {
    if (!snapshot.exists()) {
      console.log('no mocs for this user');
      dispatch(setMOCs([]));
      return;
    }
    const mocIds = Object.keys(snapshot.val());
    Promise.all(mocIds.map(id => firebasedb.ref(`mocData/${id}`).once('value').then((mocSnap) => {
      const moc = mocSnap.val();
      const mocData = {
        govtrack_id: moc.govtrack_id,
        member_name: moc.displayName,
      };
      return mocData;
    })))
      .then((userMocData) => {
        dispatch(setMOCs(userMocData));
      })
      .catch(err => console.log(err));
  });
};
