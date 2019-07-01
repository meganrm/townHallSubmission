import React from 'react';
import {
  Select,
} from 'antd';
const { Option } = Select;

export const renderEventOptions = (lawmakerType) => {
  let eventsArray = [];
  switch (lawmakerType) {
    case 'fedRep':
      eventsArray = ['No Events', 'Town Hall', 'Tele-Town Hall', 'Empty Chair Town Hall', 'Campaign Town Hall', 'Adopt-A-District/State', 'DC Event', 'Office Hours', 'Other'];
      break;
    case 'stateRep':
      eventsArray = ['No Events', 'Town Hall', 'Tele-Town Hall', 'Empty Chair Town Hall', 'Campaign Town Hall', 'Adopt-A-District/State', 'Hearing', 'Office Hours', 'Other'];
      break;
    case 'fedCandidate':
      eventsArray = ['No Events', 'Campaign Town Hall', 'Other', 'Ticketed Event'];
      break;
    case 'stateCandidate':
      eventsArray = ['No Events', 'Campaign Town Hall', 'Other', 'Ticketed Event'];
      break;
    default:
      eventsArray = ['No Events', 'Town Hall', 'H.R. 1 Town Hall', 'H.R. 1 Activist Event', 'Tele-Town Hall', 'Ticketed Event', 'Campaign Town Hall', 'Adopt-A-District/State', 'Empty Chair Town Hall', 'Hearing', 'DC Event', 'Office Hours', 'Other'];
  }
  return (
    <Select
      key="meetingType"
      placeholder="Meeting type"
    >
      {eventsArray.map((item, i) => {
        return (
        <Option value={item} key={i}>
          {item}
        </Option>
        )
      })}
    </Select>
  );
}
