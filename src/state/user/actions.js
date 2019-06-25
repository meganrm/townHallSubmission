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

const addLink = (payload) => ({
  type: 'ADD_LINK',
  payload,
});

const editLink = (payload) => ({
  type: 'EDIT_LINK',
  payload
});

const deleteLink = (payload) => ({
  type: 'DELETE_LINK',
  payload
});

export const setSelectedLink = (payload) => ({
  type: 'SET_SELECTED_LINK',
  payload
})

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
        return mocData;
      })
    }))
      .then((userMocData) => {
        dispatch(setMOCs(userMocData))
      })
      .catch((err) => console.log(err))
  })
}

/******************* MOC LINK API******************************* */
export const setSelectedMember = payload  => ({
  payload,
  type: 'SET_SELECTED_MEMBER',
});

export const getSelectedMemberInfo = payload => (dispatch) => {
  firebasedb.ref(`mocData/${payload.govtrack_id}/helpful_links`).once('value').then((snapshot) => {
    let links = snapshot.val();
    for (let prop in links) {
      links[prop].id = prop;
    }
    payload.moc_links = links;
    dispatch(setSelectedMember(payload));
  });
}

export const addMemberLink = payload => (dispatch) => {
  console.log(payload);
  if (payload.link_title === undefined || payload.link_url === undefined) {
    return;
  } else {
    let link = {
      link_title: payload.link_title,
      url: payload.link_url
    }
    return firebasedb.ref(`mocData/${payload.member_id}/helpful_links`).push(link).then((ref) => {
      let newLinkInfo = {
        id: ref.key,
        link
      }
      dispatch(addLink(newLinkInfo))
    })
  }
}

export const editMemberLink = payload => (dispatch) => {
  let link = {
    link_title: payload.linkInfo.link_title,
    url: payload.linkInfo.url
  }
  return firebasedb.ref(`mocData/${payload.moc_id}/helpful_links/${payload.link_id}`).update(link).then(() => {
    dispatch(editLink(payload));
  })
}

export const deleteMemberLink = payload => (dispatch) => {
  return firebasedb.ref(`mocData/${payload.moc_id}/helpful_links/${payload.link_id}`).remove().then(() => {
    dispatch(deleteLink(payload));
  })
}