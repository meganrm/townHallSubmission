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

export const startSetUserMocs = payload => (dispatch) => {
  firebasedb.ref(`users/${payload.uid}/mocs`).once('value').then((snapshot) => {
    const mocIds = Object.keys(snapshot.val());
    Promise.all(mocIds.map((id) => {
      return firebasedb.ref(`mocData/${id}`).once('value').then((snapshot) => {
        let moc = snapshot.val();
        let mocData = {
          govtrack_id: moc.govtrack_id,
          member_name: moc.displayName,
        }
        return mocData;
      })
    }))
      .then((userMocData) => {
        dispatch(setMOCs(userMocData))
      })
      .catch((err) => console.log(err))
  })
}