import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Input,
  DatePicker,
  Form,
  TimePicker,
} from 'antd';

import { formItemLayout } from '../../constants';

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
    this.setState({ repeatingEvent: e.target.checked });
  }

  onChangeDate(date) {
    const { setDate } = this.props;
    setDate(date);
  }

  onChangeStartTime(time, timeString) {
    const {
      setStartTime,
    } = this.props;
    setStartTime(timeString);
  }

  onChangeEndTime(time, timeString) {
    const {
      setEndTime,
    } = this.props;
    setEndTime(timeString);
  }

  renderReatingEvent() {
    const {
      getFieldDecorator,
    } = this.props;
    const { repeatingEvent } = this.state;
    return repeatingEvent ? (
      <FormItem 
        className="repeating"
        label="Repeating Event"
        {...formItemLayout}
      >
        {getFieldDecorator('repeatingEvent', {
          initialValue: '',
        })(
          <Input
            type="text"
            className="input-underline"
            id="repeatingEvent"
            placeholder="Eg. First Tuesday of the month"
          />,
        )}
      </FormItem>
    )
      : (
        <FormItem>
          {
            getFieldDecorator('date', {
              initialValue: undefined,
              rules: [{
                message: 'Please enter a valid date',
                required: true,
              }],
            })(
              <DatePicker onChange={this.onChangeDate} />,
            )}
        </FormItem>
      );
  }

  render() {
    const {
      getFieldDecorator,
    } = this.props;
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
        <FormItem
          label="Start time"
          {...formItemLayout}
        >
          {
            getFieldDecorator(
              'time', {
                initialValue: undefined,
                rules: [{
                  message: 'Please enter a valid time',
                  required: true,
                }],
              },
            )(
              <TimePicker
                use12Hours
                minuteStep={15}
                format="h:mm A"
                defaultOpenValue={moment().minute(0)}
                onChange={this.onChangeStartTime}
              />,
            )}
        </FormItem>
        <FormItem
          label = "End time"
          {...formItemLayout}
        >
          {getFieldDecorator(
            'endTime', {
              initialValue: undefined,
            },
          )(
            <TimePicker
              use12Hours
              minuteStep={15}
              format="h:mm A"
              onChange={this.onChangeEndTime}
            />,
          )}
        </FormItem>
      </React.Fragment>
    );
  }
}

DateTimeForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
  setEndTime: PropTypes.func.isRequired,
  setStartTime: PropTypes.func.isRequired,
};

export default DateTimeForm;
