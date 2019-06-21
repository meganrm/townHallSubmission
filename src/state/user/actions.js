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
    Promise.all(mocIds.map((id) => {
      return firebasedb.ref(`mocData/${id}`).once('value').then((snapshot) => {
        let moc = snapshot.val();
        let mocData = {
          govtrack_id: moc.govtrack_id,
          member_name: moc.displayName,
        }
        return firebasedb.ref(`mocData/${mocData.govtrack_id}/helpful_links`).once('value').then((snapshot) => {
          mocData.moc_links = snapshot.val();
          return mocData;
        })
      })
    }))
      .then((userMocData) => {
        dispatch(setMOCs(userMocData))
      })
      .catch((err) => console.log(err))
  })
}

/******************* MOC LINK API******************************* */
export const setCurrentMemberLinks = payload => (state, dispatch) => {
  
}

export const addMemberLink = payload => (dispatch) => {
  console.log(payload);
  if (payload.link_title === undefined || payload.link_url === undefined) {
    console.log('incomplete link info: ', payload);
    return; //flag for incomplete data
  } else {
    firebasedb.ref(`mocData/${payload.member_id}/helpful_links`).push({
      link_title: payload.link_title,
      url: payload.link_url
    })
  }
}

export const editMemberLink = payload => (dispatch) => {
  console.log(payload);
  firebasedb.ref(`mocData/${payload.moc_id}/helpful_links/${payload.link_id}`).update({
    link_title: payload.linkInfo.link_title,
    url: payload.linkInfo.url
  });
}

export const deleteMemberLink = payload => (dispatch) => {
  console.log(payload);
  firebasedb.ref(`mocData/${payload.moc_id}/helpful_links/${payload.link_id}`).remove();
}