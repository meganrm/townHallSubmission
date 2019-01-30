import moment from 'moment';
import { find } from 'lodash';

import statesAb from '../../data/states';
import { EVENT_TYPES } from '../../constants';

const initialState = {
  Location: null,
  Member: null,
  Notes: '',
  Time: null,
  address: null,
  chamber: null,
  dateObj: 0,
  dateString: null,
  dateValid: false,
  disclaimer: null,
  displayName: null,
  district: null,
  districts: {},
  eventId: null,
  eventName: null,
  govtrack_id: null,
  iconFlag: null,
  lat: 0,
  lng: 0,
  meetingType: null,
  members: [],
  office: null,
  party: null,
  repeatingEvent: null,
  state: null,
  stateName: null,
  thp_id: null,
  timeEnd: null,
  timeEnd24: null,
  timeStart24: null,
  timeZone: null,
  userID: null,
  yearMonthDay: null,
  zoneString: null,
};

const townhallReducer = (state = initialState, { type, payload }) => {
  let district;
  let chamber;
  const timeFormats = ['hh:mm A', 'h:mm A'];
  switch (type) {
  case 'RESET_TOWNHALL':
    return initialState;

  case 'SET_DISTRICT':
    return {
      ...state,
      district: payload.district,
    };

  case 'SET_US_STATE':
    return {
      ...state,
      state: payload,
      stateName: statesAb[payload],
    };

  case 'SET_DATA_FROM_PERSON':
    chamber = payload.chamber;

    if (payload.type === 'sen' || payload.chamber === 'upper' || payload.chamber === 'Senate') {
      district = null;
      chamber = 'upper';
    } else if (payload.type === 'rep' || payload.chamber === 'lower' || payload.chamber === 'House') {
      chamber = 'lower';
      const zeropadding = '00';
      const updatedDistrict = zeropadding.slice(0, zeropadding.length - payload.district.length) + payload.district;
      district = updatedDistrict;
    } else if (payload.role === 'Gov') {
      chamber = 'statewide';
      district = null;
    } else if (payload.role === 'Pres') {
      chamber = 'nationwide';
      district = null;
    }
    return {
      ...state,
      chamber,
      district,
      state: payload.state || null,
      displayName: payload.displayName,
      city: payload.city || null,
      Member: payload.displayName,
      govtrack_id: payload.govtrack_id || null,
      thp_id: payload.thp_id || payload.thp_key || null,
      stateName: payload.stateName || statesAb[payload.state] || null,
      party: payload.party,
      office: payload.role || null,
      eventId: payload.eventId,
    };
  case 'SET_ADDITIONAL_MEMBER':
    if (payload.type === 'sen' || payload.chamber === 'upper') {
      district = null;
      chamber = 'upper';
    } else if (payload.type === 'rep' || payload.chamber === 'lower') {
      chamber = 'lower';
      const zeropadding = '00';
      const updatedDistrict = zeropadding.slice(0, zeropadding.length - payload.district.length) + payload.district;
      district = updatedDistrict;
    } else if (payload.role === 'Gov') {
      chamber = 'statewide';
      district = null;
    }
    return {
      ...state,
      members: [
        ...state.members,
        {
          chamber,
          displayName: payload.displayName,
          district,
          govtrack_id: payload.govtrack_id || null,
          office: payload.role || null,
          party: payload.party,
          state: payload.state,
          thp_id: payload.thp_id || payload.thp_key || null,

        }],
      districts: {
        ...state.districts,
        [payload.state]: state.districts[payload.state] ? [...state.districts[payload.state], district] : [district],
      },
    };
  case 'SET_MEETING_TYPE':
    return {
      ...state,
      meetingType: payload,
      iconFlag: find(EVENT_TYPES, {
        name: payload,
      }) ? find(EVENT_TYPES, {
          name: payload,
        }).iconFlag : null,
    };
  case 'SET_START_TIME':
    return {
      ...state,
      timeStart24: moment(payload, timeFormats).format('HH:mm:ss'),
      Time: moment(payload, timeFormats).format('h:mm A'),
      timeEnd24: moment(payload, timeFormats).add(2, 'h').format('HH:mm:ss'),
      timeEnd: moment(payload, timeFormats).add(2, 'h').format('h:mm A'),
    };
  case 'SET_END_TIME':
    return {
      ...state,
      timeEnd24: moment(payload, timeFormats).format('HH:mm:ss'),
      timeEnd: moment(payload, timeFormats).format('h:mm A'),
    };
  case 'SET_DATE':
    return {
      ...state,
      yearMonthDay: moment(payload).format('YYYY-MM-DD'),
      dateString: moment(payload).format('ddd, MMM D YYYY'),
    };
  case 'SET_LAT_LNG':
    return {
      ...state,
      lat: payload.lat,
      lng: payload.lng,
      address: payload.address,
      state: state.state || payload.state || null,
      stateName: state.stateName || payload.stateName || null,
    };
  case 'SET_TIME_ZONE':
    return {
      ...state,
      zoneString: payload.zoneString,
      timeZone: payload.timeZone,
      dateObj: payload.dateObj,
    };
  case 'ADD_DISCLAIMER':
    return {
      ...state,
      disclaimer: 'Town Hall Project lists this event and any '
            + 'third-party link as public information and not '
            + 'as an endorsement of a participating candidate, campaign, or party.',

    };
  case 'CLEAR_DISCLAIMER':
    return {
      ...state,
      disclaimer: null,
    };
  case 'MERGE_NOTES':
    if (state.disclaimer) {
      return {
        ...state,
        Notes: state.Notes ? `${state.Notes} ${state.disclaimer}` : state.disclaimer,
        disclaimer: null,
      };
    }
    return state;
  case 'SET_VALUE':
    return {
      ...state,
      [payload.key]: payload.value,
    };
  default:
    return state;
  }
};

export default townhallReducer;
