export const disclaimerMeetingTypes = ['Ticketed Event', 'Campaign Town Hall', 'Campaign Tele-Town Hall'];
export const MANUAL_MODE = 'manual';
export const MOC_MODE = 'moc';
export const CANDIDATE_MODE = 'candidate';

export const STATE_LEGS = {
  AZ: 'Arizona',
  CO: 'Colorado',
  FL: 'Florida',
  ME: 'Maine',
  MD: 'Maryland',
  MI: 'Michigan',
  NV: 'Nevada',
  NC: 'North Carolina',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  VA: 'Virginia',
};

export const NO_EVENTS = 'No Events';
export const TOWN_HALL = 'Town Hall';
export const TELE_TOWN_HALL = 'Tele-Town Hall';
export const EMPTY_CHAIR_TOWN_HALL = 'Empty Chair Town Hall';
export const CAMPAIGN_TOWN_HALL = 'Campaign Town Hall';
export const CAMPAIGN_TELE_TOWN_HALL = 'Campaign Tele-Town Hall';
export const OTHER = 'Other';
export const TICKETED_EVENT = 'Ticketed Event';
export const ADOPT_A_DISTRICT = 'Adopt-A-District/State';
export const DC_EVENT = 'DC Event';
export const OFFICE_HOURS = 'Office Hours';
export const HEARING = 'Hearing';
export const HR_1_ACTIVIST_EVENT = 'H.R. 1 Activist Event';
export const HR_1_TOWN_HALL = 'H.R. 1 Town Hall';
export const GUN_SAFETY_ACTIVISM = 'Gun Safety Activist Event';

export const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

export const IN_PERSON_ICON_FLAG = 'in-person';
export const ACTIVISM_ICON_FLAG = 'activism';
export const TELE_ICON_FLAG = 'tele';
export const CAMPAIGN_ICON_FLAG = 'campaign';
export const STAFF_ICON_FLAG = 'staff';
export const HR_1_ICON_FLAG = 'hr-one';

export const EVENT_TYPES = {
  town_hall: {
    name: TOWN_HALL,
    iconFlag: IN_PERSON_ICON_FLAG,
  },
  hr_1_town_hall: {
    name: HR_1_TOWN_HALL,
    iconFlag: HR_1_ICON_FLAG,
  },
  hr_1_activist_event: {
    name: HR_1_ACTIVIST_EVENT,
    iconFlag: HR_1_ICON_FLAG,
  },
  tele_town_hall: {
    name: TELE_TOWN_HALL,
    iconFlag: TELE_ICON_FLAG,
  },
  ticketed_event: {
    name: 'Ticketed Event',
    iconFlag: IN_PERSON_ICON_FLAG,
  },
  campaign_town_hall: {
    name: 'Campaign Town Hall',
    iconFlag: CAMPAIGN_ICON_FLAG,
  },
  campaign_tele_town_hall: {
    name: 'Campaign Tele-Town Hall',
    iconFlag: CAMPAIGN_ICON_FLAG,
  },
  adopt_a_district: {
    name: 'Adopt-A-District/State',
    iconFlag: ACTIVISM_ICON_FLAG,
  },
  empty_chair: {
    name: 'Empty Chair Town Hall',
    iconFlag: ACTIVISM_ICON_FLAG,
  },
  hearing: {
    name: 'Hearing',
    iconFlag: null,
  },
  office_hours: {
    name: 'Office Hours',
    iconFlag: STAFF_ICON_FLAG,
  },
  gun_safety_activism: {
    name: GUN_SAFETY_ACTIVISM,
    iconFlag: ACTIVISM_ICON_FLAG,
  },
  other: {
    name: 'Other',
    iconFlag: null,
  },
  dc_event: {
    name: 'DC Event',
    iconFlag: null,
  },
};
export const REP_EVENTS = [
  NO_EVENTS,
  TOWN_HALL,
  TELE_TOWN_HALL,
  EMPTY_CHAIR_TOWN_HALL,
  CAMPAIGN_TOWN_HALL,
  CAMPAIGN_TELE_TOWN_HALL,
  ADOPT_A_DISTRICT,
  DC_EVENT,
  OFFICE_HOURS,
  GUN_SAFETY_ACTIVISM,
  HEARING,
  OTHER,
];
export const FED_CANDIDATE_EVENTS = [NO_EVENTS, CAMPAIGN_TOWN_HALL, CAMPAIGN_TELE_TOWN_HALL, OTHER, TICKETED_EVENT];
export const STATE_CANDIDATE_EVENTS = [NO_EVENTS, CAMPAIGN_TOWN_HALL, CAMPAIGN_TELE_TOWN_HALL, OTHER, TICKETED_EVENT];
export const DEFAULT_EVENTS = [
  NO_EVENTS,
  TOWN_HALL,
  HR_1_TOWN_HALL,
  HR_1_ACTIVIST_EVENT,
  TELE_TOWN_HALL,
  TICKETED_EVENT,
  CAMPAIGN_TOWN_HALL,
  CAMPAIGN_TELE_TOWN_HALL,
  ADOPT_A_DISTRICT,
  EMPTY_CHAIR_TOWN_HALL,
  HEARING,
  DC_EVENT,
  OFFICE_HOURS,
  GUN_SAFETY_ACTIVISM,
  OTHER,
];
