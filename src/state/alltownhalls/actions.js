import { firebasedb } from '../../scripts/util/setupFirebase';


export const setEventsForCheckingDups = payload => ({
  payload,
  type: 'SET_EVENTS_FOR_DUP_CHECK',
});

const getSubmittedEvents = () => firebasedb.ref('UserSubmission').once('value')
  .then((snapshot) => {
    const allTownHalls = [];
    snapshot.forEach((ele) => {
      allTownHalls.push(ele.val());
    });
    return allTownHalls;
  });

const getLiveEvents = () => firebasedb.ref('townHalls').once('value')
  .then((snapshot) => {
    const allTownHalls = [];
    snapshot.forEach((ele) => {
      allTownHalls.push(ele.val());
    });
    return allTownHalls;
  });

export const getAllEventToCheckDups = () => dispatch => Promise.all([getLiveEvents(), getSubmittedEvents()])
  .then((events) => {
    dispatch(setEventsForCheckingDups([...events[0], ...events[1]]));
  });
