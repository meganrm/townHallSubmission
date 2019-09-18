import { firebasedb } from '../../scripts/util/setupFirebase';


export const setEventsForCheckingDups = payload => ({
  payload,
  type: 'SET_EVENTS_FOR_DUP_CHECK',
});

const getSubmittedEvents = (submissionUrl) => firebasedb.ref(submissionUrl).once('value')
  .then((snapshot) => {
    const allTownHalls = [];
    snapshot.forEach((ele) => {
      allTownHalls.push(ele.val());
    });
    return allTownHalls;
  });

const getLiveEvents = (liveUrl) => firebasedb.ref(liveUrl).once('value')
  .then((snapshot) => {
    const allTownHalls = [];
    snapshot.forEach((ele) => {
      allTownHalls.push(ele.val());
    });
    return allTownHalls;
  });

export const getAllEventToCheckDups = (liveUrl, submissionUrl) => dispatch => Promise.all([getLiveEvents(liveUrl), getSubmittedEvents(submissionUrl)])
  .then((events) => {
    dispatch(setEventsForCheckingDups([...events[0], ...events[1]]));
  });
