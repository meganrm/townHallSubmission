import React from 'react';
import moment from 'moment';
import {
  Checkbox,
  Input,
  DatePicker,
  Form,
  TimePicker,
} from 'antd';

const FormItem = Form.Item;

class DateTimeForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeStartTime = this.onChangeStartTime.bind(this);
    this.onChangeEndTime = this.onChangeEndTime.bind(this);
    this.onRepeatingEventCheckboxChanged = this.onRepeatingEventCheckboxChanged.bind(this);
    this.state = {
      repeatingEvent: false,
    };
  }

  onRepeatingEventCheckboxChanged(e) {
    console.log(`checked = ${e.target.checked}`);
    this.setState({ repeatingEvent: e.target.checked });
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

  renderReatingEvent() {
    const { repeatingEvent } = this.state;
    return repeatingEvent ? (
      <FormItem className="repeating">
        <label htmlFor="repeatingEvent">
          Repeating Event
        </label>
        <Input
          type="text"
          className="input-underline"
          id="repeatingEvent"
          placeholder="Eg. First Tuesday of the month"
        />
      </FormItem>
    )
      : (
        <FormItem>
          <DatePicker onChange={this.onChangeDate} />
          <span id="yearMonthDay-error" className="help-block error-message hidden">
          Please enter a valid date
          </span>
        </FormItem>
      );
  }

  render() {
    return (
      <React.Fragment>
        <FormItem className="checkbox">
          <Checkbox
            onChange={this.onRepeatingEventCheckboxChanged}
          >
            Repeating Event
          </Checkbox>
        </FormItem>
        {this.renderReatingEvent()}
        <FormItem>
          <label htmlFor="Time">
          Start Time
          </label>
          <TimePicker
            use12Hours
            format="h:mm a"
            onChange={this.onChangeStartTime}
          />
          <span id="timeStart24-error" className="help-block error-message hidden">
          Please enter a valid time
          </span>
        </FormItem>
        <FormItem>
          <label htmlFor="endTime">
          End Time
          </label>
          <TimePicker
            use12Hours
            format="h:mm a"
            onChange={this.onChangeEndTime}
          />
        </FormItem>
      </React.Fragment>
    );
  }
}

export default DateTimeForm;
