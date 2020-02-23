import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Input,
  DatePicker,
  Form,
  TimePicker,
  Alert,
} from 'antd';
import { includes } from 'lodash';

import { formItemLayout } from '../../constants';

const FormItem = Form.Item;

class DateTimeForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeStartTime = this.onChangeStartTime.bind(this);
    this.onChangeEndTime = this.onChangeEndTime.bind(this);
    this.closeTimeStart = this.closeTimeStart.bind(this);
    this.closeEndTime = this.closeEndTime.bind(this);
    this.handleOpenStartChange = this.handleOpenStartChange.bind(this);
    this.handleOpenEndChange = this.handleOpenEndChange.bind(this);
    this.onRepeatingEventCheckboxChanged = this.onRepeatingEventCheckboxChanged.bind(this);
    this.state = {
      repeatingEvent: false,
      startOpen: false,
      endTimeOpen: false,
      renderWarning: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { townHallId } = this.props;
    if (prevProps.townHallId && !townHallId) {
      this.setState({
        renderWarning: false,
      });
    }
  }

  onRepeatingEventCheckboxChanged(e) {
    this.setState({ repeatingEvent: e.target.checked });
  }

  onChangeDate(date) {
    const { setDate } = this.props;
    const { renderWarning } = this.state;
    if (moment(date).isBefore(moment(), 'day')) {
      this.setState({
        renderWarning: true,
      });
    } else if (renderWarning) {
      this.setState({
        renderWarning: false,
      });
    }
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

  closeTimeStart() {
    this.setState({ startOpen: false });
  }

  closeEndTime() {
    this.setState({ endTimeOpen: false });
  }

  handleOpenStartChange(open) {
    this.setState({ startOpen: open });
  }

  handleOpenEndChange(open) {
    this.setState({ endTimeOpen: open });
  }

  renderRepeatingEvent() {
    const {
      getFieldDecorator,
      requiredFields,
      getError,
    } = this.props;
    const { repeatingEvent, renderWarning } = this.state;
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
        <FormItem
          help={getError('date') || ''}
        >
          {
            getFieldDecorator('date', {
              initialValue: undefined,
              rules: [{
                message: 'Please enter a valid date',
                required: includes(requiredFields, 'date'),
              }],
            })(
              <DatePicker onChange={this.onChangeDate} />,
            )}
          {renderWarning && (
            <Alert
              message={(<p>Date is in the past, make sure that is what you meant</p>)}
              type="warning"
              showIcon
              closable
            />
          )}
        </FormItem>
      );
  }

  render() {
    const {
      getFieldDecorator,
      getError,
      requiredFields,
    } = this.props;

    const {
      startOpen,
      endTimeOpen,
    } = this.state;
    return (
      <React.Fragment>
        <FormItem className="checkbox">
          <Checkbox
            onChange={this.onRepeatingEventCheckboxChanged}
          >
            Repeating Event
          </Checkbox>
        </FormItem>
        {this.renderRepeatingEvent()}
        <FormItem
          label="Start time"
          help={getError('time') || ''}
          {...formItemLayout}
        >
          {
            getFieldDecorator(
              'time', {
                initialValue: undefined,
                rules: [{
                  message: 'Please enter a valid time',
                  required: includes(requiredFields, 'time'),
                }],
              },
            )(
              <TimePicker
                use12Hours
                minuteStep={15}
                format="h:mm A"
                defaultOpenValue={moment().hour(0).minute(0)}
                onChange={this.onChangeStartTime}
                open={startOpen}
                onOpenChange={this.handleOpenStartChange}
                allowClear={false}
                addon={() => (
                  <Button size="small" type="primary" onClick={this.closeTimeStart}>
                    Ok
                  </Button>
                )}
              />,
            )}
        </FormItem>
        <FormItem
          label="End time"
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
              allowClear={false}
              open={endTimeOpen}
              onOpenChange={this.handleOpenEndChange}
              onChange={this.onChangeEndTime}
              addon={() => (
                <Button size="small" type="primary" onClick={this.closeEndTime}>
                    Ok
                </Button>
              )}
            />,
          )}
        </FormItem>
      </React.Fragment>
    );
  }
}

DateTimeForm.propTypes = {
  getError: PropTypes.func.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  requiredFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  setDate: PropTypes.func.isRequired,
  setEndTime: PropTypes.func.isRequired,
  setStartTime: PropTypes.func.isRequired,
  townHallId: PropTypes.string,
};

DateTimeForm.defaultProps = {
  townHallId: null,
};

export default DateTimeForm;
