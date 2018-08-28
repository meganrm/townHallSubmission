import React from 'react';
import moment from 'moment';
import {
  Input,
  DatePicker,
  TimePicker,
} from 'antd';

class DateTimeForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeStartTime = this.onChangeStartTime.bind(this);
    this.onChangeEndTime = this.onChangeEndTime.bind(this);
  }

  onChangeDate(date) {
    const { setDate } = this.props;
    setDate(date);
  }

  onChangeStartTime(time, timeString) {
    const {
      setStartTime,
      setEndTime,
    } = this.props;
    setStartTime(timeString);
    setEndTime(moment(timeString).add(2, 'h'));
  }

  onChangeEndTime(time, timeString) {
    const {
      setEndTime,
    } = this.props;
    setEndTime(timeString);
  }

  render() {
    return (
      <React.Fragment>
        <div className="checkbox col-sm-12">
          <Input type="checkbox" class="date-string" />
          <span className="checkbox-label">
Click for repeating event (eg. 'First Wed')
</span>
              </div>
            <div className="form-group col-sm-12">
                <DatePicker onChange={this.onChangeDate} />
          <span id="yearMonthDay-error" className="help-block error-message hidden">
Please enter a valid date
</span>
        </div>
            <div className="form-group hidden repeating">
          <label htmlFor="repeatingString">
Repeating Event
</label>
                <input type="text" className="form-control input-underline " id="repeatingEvent" placeholder="Eg. First Tuesday of the month" />
        </div>
            <div className="form-group col-sm-6">
          <label htmlFor="Time">
Start Time
</label>
          <TimePicker use12Hours format="h:mm a" onChange={this.onChangeStartTime} />
          <span id="timeStart24-error" className="help-block error-message hidden">
Please enter a valid time
</span>
              </div>
        <div className="form-group col-sm-6">
          <label htmlFor="endTime">
End Time
</label>
          <TimePicker use12Hours format="h:mm a" onChange={this.onChangeEndTime} />
        </div>
      </React.Fragment>
    );
  }
}

export default DateTimeForm;
