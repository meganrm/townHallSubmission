import request from 'superagent';

export const setUsState = payload => ({
  payload,
  type: 'SET_SELECTED_US_STATE',
});

export const toggleMemberCandidate = payload => ({
  payload,
  type: 'TOGGLE_MODE',
});

export const setTempAddress = payload => ({
  payload,
  type: 'SET_TEMP_ADDRESS',
});

export const resetSelections = () => ({
  type: 'RESET_SELECTIONS',
});


export const lookUpAddress = payload => dispatch => request
  .get('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB868a1cMyPOQyzKoUrzbw894xeoUhx9MM')
  .set('Accept', 'application/json')
  .query({
    address: payload,
  })
  .then((r) => {
    const {
      results,
    } = r.body;
    if (results) {
      const res = {
        address: results[0].formatted_address.split(', USA')[0],
        lat: results[0].geometry.location.lat,
        lng: results[0].geometry.location.lng,
      };
      return (dispatch(setTempAddress(res)));
    }
    return Promise.reject('error geocoding', r.body);
  })
  .catch((e) => {
    console.log(e);
  });
