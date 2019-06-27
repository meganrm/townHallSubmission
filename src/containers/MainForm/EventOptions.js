import React from 'react';
import {
  Select,
} from 'antd';
const { Option } = Select;

export const renderEventOptions = (mode, state) => {
  let lawmakerType;
  if (mode === 'moc' && state === null) {
    lawmakerType = 'fedRep';
  } else if (mode === 'moc' && state !== null) {
    lawmakerType = 'stateRep';
  } else if (mode === 'candidate' && state === null) {
    lawmakerType = 'fedCandidate';
  } else if (mode === 'candidate' && state !== null) {
    lawmakerType = 'stateCandidate';
  }
  switch (lawmakerType) {
    case 'fedRep':
      return (
        <Select
          key="meetingType"
          placeholder="Meeting type"
        >
          <Option className="text-secondary" value="No Events">
            No new events
          </Option>
          <Option value="Town Hall">
            Town Hall
          </Option>
          <Option value="Tele-Town Hall">
            Tele-Town Hall
          </Option>
          <Option value="Empty Chair Town Hall">
            Empty Chair Town Hall
          </Option>
          <Option value="Campaign Town Hall">
            Campaign Town Hall
          </Option>
          <Option value="Adopt-A-District/State">
            Adopt-A-District/State
          </Option>
          <Option value="DC Event">
            DC Event
          </Option>
          <Option value="Office Hours">
            Office Hours
          </Option>
          <Option value="Other">
            Other
          </Option>
        </Select>
      );
    case 'stateRep':
      return (
        <Select
          key="meetingType"
          placeholder="Meeting type"
        >
          <Option className="text-secondary" value="No Events">
            No new events
          </Option>
          <Option value="Town Hall">
            Town Hall
          </Option>
          <Option value="Tele-Town Hall">
            Tele-Town Hall
          </Option>
          <Option value="Empty Chair Town Hall">
            Empty Chair Town Hall
          </Option>
          <Option value="Campaign Town Hall">
            Campaign Town Hall
          </Option>
          <Option value="Adopt-A-District/State">
            Adopt-A-District/State
          </Option>
          <Option value="Hearing">
            Hearing
          </Option>
          <Option value="Office Hours">
            Office Hours
          </Option>
          <Option value="Other">
            Other
          </Option>
        </Select>
      );
    case 'fedCandidate':
      return (
        <Select
          key="meetingType"
          placeholder="Meeting type"
        >
          <Option className="text-secondary" value="No Events">
            No new events
          </Option>
          <Option value="Campaign Town Hall">
            Campaign Town Hall
          </Option>
          <Option value="Other">
            Other
          </Option>
          <Option value="Ticketed Event">
            Ticketed Event
          </Option>
        </Select>
      );
    case 'stateCandidate':
      return (
        <Select
          key="meetingType"
          placeholder="Meeting type"
        >
          <Option className="text-secondary" value="No Events">
            No new events
          </Option>
          <Option value="Campaign Town Hall">
            Campaign Town Hall
          </Option>
          <Option value="Other">
            Other
          </Option>
          <Option value="Ticketed Event">
            Ticketed Event
          </Option>
        </Select>
      );
    default:
      return (
        <Select
          key="meetingType"
          placeholder="Meeting type"
        >
          <Option value="Town Hall">
            Town Hall
                  </Option>
          <Option value="H.R. 1 Town Hall">
            H.R. 1 Town Hall
                  </Option>
          <Option value="H.R. 1 Activist Event">
            H.R. 1 Activist Event
                  </Option>
          <Option value="Tele-Town Hall">
            Tele-Town Hall
          </Option>
          <Option value="Ticketed Event">
            Ticketed Event
          </Option>
          <Option value="Campaign Town Hall">
            Campaign Town Hall
                  </Option>
          <Option value="Adopt-A-District/State">
            Adopt-A-District/State
                  </Option>
          <Option value="Empty Chair Town Hall">
            Empty Chair Town Hall
          </Option>
          <Option value="Hearing">
            Hearing
          </Option>
          <Option value="DC Event">
            DC Event
          </Option>
          <Option value="Office Hours">
            Office Hours
          </Option>
          <Option value="Other">
            Other
          </Option>
          <Option className="text-secondary" value="No Events">
            No new events
                  </Option>
        </Select>
      );
  }
}