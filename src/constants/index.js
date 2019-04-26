export const disclaimerMeetingTypes = ['Ticketed Event', 'Campaign Town Hall'];
export const MANUAL_MODE = 'manual';
export const MOC_MODE = 'moc';
export const CANDIDATE_MODE = 'candidate';

export const STATE_LEGS = {
  AZ: 'Arizona',
  CO: 'Colorado',
  // FL: 'Florida',
  MD: 'Maryland',
  // ME: 'Maine',
  MI: 'Michigan',
  NC: 'North Carolina',
  NV: 'Nevada',
  OR: 'Oregon',
  // PA: 'Pennsylvania',
  VA: 'Virginia',
};

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
    name: 'Town Hall',
    iconFlag: IN_PERSON_ICON_FLAG,
  },
  hr_1_town_hall: {
    name: 'H.R. 1 Town Hall',
    iconFlag: HR_1_ICON_FLAG,
  },
  hr_1_activist_event: {
    name: 'H.R. 1 Activist Event',
    iconFlag: HR_1_ICON_FLAG,
  },
  tele_town_hall: {
    name: 'Tele-Town Hall',
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
  other: {
    name: 'Other',
    iconFlag: null,
  },
  dc_event: {
    name: 'DC Event',
    iconFlag: null,
  },
};
