import request from 'superagent';
import { find } from 'lodash';

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

export const clearTempAddress = () => ({
  type: 'CLEAR_ADDRESS',
});

export const resetSelections = () => ({
  type: 'RESET_SELECTIONS',
});

export const setFormKeys = payload => ({
  payload,
  type: 'SET_FORM_KEYS',
});

export const resetFormKeys = () => ({
  type: 'RESET_FORM_KEYS',
});


export const lookUpAddress = payload => dispatch => request
  .get('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDP8q2OVisSLyFyOUU6OTgGjNNQCq7Q3rE')
  .set('Accept', 'application/json')
  .query({
    address: payload,
  })
  .then((r) => {
    const {
      results,
    } = r.body;
    if (results && results[0]) {
      const stateData = find(results[0].address_components, { types: ['administrative_area_level_1', 'political'] });
      const res = {
        address: results[0].formatted_address.split(', USA')[0],
        stateName: stateData ? stateData.long_name : null,
        state: stateData ? stateData.short_name : null,
        lat: results[0].geometry.location.lat,
        lng: results[0].geometry.location.lng,
      };
      return (dispatch(setTempAddress(res)));
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('error geocoding', r.body);
  })
  .catch((e) => {
    console.log(e);
  });
