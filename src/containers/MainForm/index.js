import React from 'react';
import PropTypes from 'prop-types';
import {
  mapValues,
  map,
} from 'lodash';
import { connect } from 'react-redux';
import {
  Alert,
  BackTop,
  Form,
  Button,
  Input,
  Select,
  Checkbox,
} from 'antd';

import {
  startSetPeople,
  requestPersonDataById,
  requestAdditionalPersonDataById,
} from '../../state/members-candidates/actions';

import {
  getAllNames,
  getAllPeople,
} from '../../state/members-candidates/selectors';

import selectionStateBranch from '../../state/selections';

import {
  getUid,
  getUserName,
} from '../../state/user/selectors';
import MemberForm from '../../components/MemberForm';
import LocationForm from '../../components/LocationForm';
import DateTimeForm from '../../components/DateTimeForm';

import 'antd/dist/antd.less';

import { getTownHall } from '../../state/townhall/selectors';
import {
  clearTempAddress,
  toggleMemberCandidate,
  lookUpAddress,
} from '../../state/selections/actions';
import {
  mergeNotes,
  addDisclaimer,
  setLatLng,
  setDate,
  setStartTime,
  setMeetingType,
  setEndTime,
  setValue,
  getTimeZone,
  saveMetaData,
  submitEventForReview,
} from '../../state/townhall/actions';
import { getFormKeys } from '../../state/selections/selectors';
import { formItemLayout } from '../../constants';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

let initFieldValue;

class MainForm extends React.Component {
  static shouldGetLatLng(currentTownHall, nextTownHall) {
    if (
      (nextTownHall.yearMonthDay
      && nextTownHall.Time
      && nextTownHall.lat)
      && (currentTownHall.yearMonthDay !== nextTownHall.yearMonthDay
      || currentTownHall.Time !== nextTownHall.Time
      || currentTownHall.timeEnd !== nextTownHall.timeEnd
      || currentTownHall.lat !== nextTownHall.lat)
    ) {
      return true;
    }
    return false;
  }

  static scrollToTop() {
    let intervalId = 0;
    function scrollStep() {
      // Check if we're at the top already. If so, stop scrolling by clearing the interval
      if (window.pageYOffset === 0) {
        clearInterval(intervalId);
      }
      window.scroll(0, window.pageYOffset - 50);
    }

    // Call the function scrollStep() every 16.66 millisecons
    intervalId = setInterval(scrollStep, 16.66);
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkSubmit = this.checkSubmit.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
    this.checkSubmit = this.checkSubmit.bind(this);
    this.getError = this.getError.bind(this);
    this.state = {
      error: null,
    };
  }

  componentWillMount() {
    const {
      startSetPeople,
      peopleNameUrl,
    } = this.props;
    startSetPeople(peopleNameUrl);
  }

  componentDidMount() {
    this.resetAll();
  }

  componentWillReceiveProps(nextProps) {
    const {
      startSetPeople,
      peopleNameUrl,
    } = this.props;
    if (peopleNameUrl !== nextProps.peopleNameUrl) {
      startSetPeople(nextProps.peopleNameUrl);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      currentTownHall,
      setTimeZone,
    } = this.props;
    if (MainForm.shouldGetLatLng(prevProps.currentTownHall, currentTownHall)) {
      setTimeZone({
        date: currentTownHall.dateString,
        lat: currentTownHall.lat,
        lng: currentTownHall.lng,
        time: currentTownHall.Time,
      });
    }
  }


  checkSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err) => {
      if (err) {
        this.setState({ error: err });
        return console.log(err);
      }
      return this.handleSubmit();
    });
  }

  handleSubmit() {
    const {
      currentTownHall,
      saveUrl,
      submitMetaData,
      peopleDataUrl,
      mergeNotes,
      submitEventForReview,
      memberId,
      userDisplayName,
      uid,
    } = this.props;
    const metaData = {
      eventId: currentTownHall.eventId,
      memberId,
      govtrack_id: currentTownHall.govtrack_id || null,
      mocDataPath: peopleDataUrl,
      thp_id: currentTownHall.thp_id || null,
      uid,
      userDisplayName,
    };

    if (currentTownHall.meetingType === 'No Events') {
      return submitMetaData(metaData);
    }
    mergeNotes();
    const submit = {
      currentTownHall: {
        ...currentTownHall,
        // deleting fields that come from the antd components
        date: null,
        time: null,
        endTime: null,
        lastUpdated: Date.now(),
        enteredBy: uid,
      },
      metaData,
      saveUrl,
    };
    submitEventForReview(submit);
    this.resetAll();
  }

  resetAll() {
    const {
      resetAllData,
    } = this.props;
    resetAllData();
    MainForm.scrollToTop();
  }

  getError(field) {
    const {
      getFieldError,
    } = this.props.form;
    return getFieldError(field);
  }

  renderErrors() {
    return (
      <Alert
        message={(<p>You are missing required fields</p>)}
        type="error"
        showIcon
        closable
      />);
  }

  render() {
    const {
      error,
    } = this.state;
    const {
      allNames,
      allPeople,
      currentTownHall,
      peopleDataUrl,
      personMode,
      clearTempAddress,
      requestPersonDataById,
      requestAdditionalPersonDataById,
      togglePersonMode,
      selectedUSState,
      geoCodeLocation,
      setLatLng,
      setDate,
      setStartTime,
      setEndTime,
      tempAddress,
      tempLat,
      tempLng,
      tempStateName,
      tempState,
      setValue,
    } = this.props;
    const {
      getFieldDecorator,
      getFieldValue,
      getFieldsValue,
      setFieldsValue,
      getFieldError,
    } = this.props.form;

    return (
      <div className="new-event-form">
        <BackTop />
        {error && this.renderErrors()}
        <Form
          onSubmit={this.checkSubmit}
          id="new-event-form-element"
          layout="horizontal"
        >
          <Button
            onClick={this.resetAll}
          >Reset fields
          </Button>
          <MemberForm
            allNames={allNames}
            allPeople={allPeople}
            currentTownHall={currentTownHall}
            peopleDataUrl={peopleDataUrl}
            requestPersonDataById={requestPersonDataById}
            requestAdditionalPersonDataById={requestAdditionalPersonDataById}
            selectedUSState={selectedUSState}
            togglePersonMode={togglePersonMode}
            getFieldDecorator={getFieldDecorator}
            personMode={personMode}
            setGenericTownHallValue={setValue}
            getFieldValue={getFieldValue}
            setFieldsValue={setFieldsValue}
            fields={getFieldsValue()}
          />
          <section className="meeting infomation">
            <h4>
              Information about the Event
            </h4>
            <FormItem>
              {getFieldDecorator('eventName', {
                trigger: 'onChange',
                initialValue: initFieldValue,
              })(
                <Input
                  className="input-underline"
                  placeholder="Name of the event"
                />,
              )}
            </FormItem>
            <FormItem
              label="Event type"
              validateStatus={getFieldError('meetingType') ? 'error' : ''}
              help={getFieldError('meetingType') || ''}
              {...formItemLayout}
            >
              {getFieldDecorator('meetingType', {
                initialValue: initFieldValue,
                rules: [{
                  message: 'Please select type of event',
                  required: true,
                }],
              })(

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
                </Select>,
              )}
            </FormItem>
          </section>
          <LocationForm
            geoCodeLocation={geoCodeLocation}
            tempAddress={tempAddress}
            address={currentTownHall.address}
            clearTempAddress={clearTempAddress}
            tempLat={tempLat}
            tempLng={tempLng}
            tempStateInfo={{ stateName: tempStateName, state: tempState }}
            saveAddress={setLatLng}
            handleInputBlur={this.handleInputBlur}
            getFieldDecorator={getFieldDecorator}
            setFieldsValue={setFieldsValue}
            getFieldValue={getFieldValue}
            getError={this.getError}
          />
          <DateTimeForm
            setDate={setDate}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
            getFieldDecorator={getFieldDecorator}
            getError={this.getError}
          />
          <section className="extra-data event-details">
            <h4>
              Additional information
            </h4>
            <FormItem>
              <label htmlFor="link">
                URL related to event (optional)
              </label>
              {getFieldDecorator('link', {
                initialValue: initFieldValue,
              })(
                <Input
                  type="url"
                  className="input-underline"
                  id="link"
                  placeholder="Link"
                />,
              )}
            </FormItem>
            <FormItem>
              <label htmlFor="linkName">
                Link display name (optional)
              </label>
              {getFieldDecorator('linkName', {
                initialValue: initFieldValue,
              })(
                <Input
                  type="text"
                  className="input-underline"
                  id="linkName"
                  placeholder="Link Name"
                />,
              )}
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('ada_accessible', {
                  initialValue: false,
                  valuePropName: 'checked',
                })(
                  <Checkbox
                    type="checkbox"
                    class="general-checkbox"
                    id="ada_accessible"
                  >
              ADA accessible?
                  </Checkbox>,
                )}
            </FormItem>
            <FormItem>
              <label htmlFor="Notes">
              Public Notes
              </label>
              {getFieldDecorator('Notes',
                {
                  initialValue: initFieldValue,
                })(
                <TextArea
                    id="Notes"
                    rows={3}
                    placeholder="Notes about event that cannot be entered anywhere else."
                  />,
              )}
            </FormItem>
            <FormItem>
              <label htmlFor="Internal-Notes">
              Internal Notes to THP Team
              </label>
              {getFieldDecorator('Internal-Notes', {
                initialValue: initFieldValue,
              })(
                <TextArea
                  rows={3}
                  id="Internal-Notes"
                  placeholder="Notes for Town Hall Project team."
                />,
              )}
            </FormItem>
          </section>
          <Button
            type="primary"
            htmlType="submit"
            name="button"
          >
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allNames: getAllNames(state),
  allPeople: getAllPeople(state),
  currentTownHall: getTownHall(state),
  formKeys: getFormKeys(state),
  peopleDataUrl: selectionStateBranch.selectors.getPeopleDataUrl(state),
  peopleNameUrl: selectionStateBranch.selectors.getPeopleNameUrl(state),
  personMode: selectionStateBranch.selectors.getMode(state),
  saveUrl: selectionStateBranch.selectors.getSaveUrl(state),
  selectedUSState: selectionStateBranch.selectors.getSelectedUSState(state),
  tempAddress: selectionStateBranch.selectors.getTempAddress(state),
  tempLat: selectionStateBranch.selectors.getTempLat(state),
  tempLng: selectionStateBranch.selectors.getTempLng(state),
  tempState: selectionStateBranch.selectors.getTempState(state),
  tempStateName: selectionStateBranch.selectors.getTempStateName(state),
  uid: getUid(state),
  userDisplayName: getUserName(state),
});

const mapDispatchToProps = dispatch => ({
  addDisclaimer: () => dispatch(addDisclaimer()),
  clearTempAddress: () => dispatch(clearTempAddress()),
  geoCodeLocation: address => dispatch(lookUpAddress(address)),
  mergeNotes: () => dispatch(mergeNotes()),
  requestAdditionalPersonDataById: (peopleDataUrl, id, index) => dispatch(requestAdditionalPersonDataById(peopleDataUrl, id, index)),
  requestPersonDataById: (peopleDataUrl, id) => dispatch(requestPersonDataById(peopleDataUrl, id)),
  setDate: date => dispatch(setDate(date)),
  setEndTime: time => dispatch(setEndTime(time)),
  setLatLng: payload => dispatch(setLatLng(payload)),
  setMeetingType: payload => dispatch(setMeetingType(payload)),
  setStartTime: time => dispatch(setStartTime(time)),
  setTimeZone: payload => dispatch(getTimeZone(payload)),
  setValue: payload => dispatch(setValue(payload)),
  startSetPeople: peopleNameUrl => dispatch(startSetPeople(peopleNameUrl)),
  submitEventForReview: payload => dispatch(submitEventForReview(payload)),
  submitMetaData: payload => dispatch(saveMetaData(payload)),
  togglePersonMode: mode => dispatch(toggleMemberCandidate(mode)),
});

MainForm.propTypes = {
  allNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  allPeople: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currentTownHall: PropTypes.shape({}).isRequired,
  peopleDataUrl: PropTypes.string.isRequired,
  peopleNameUrl: PropTypes.string.isRequired,
  personMode: PropTypes.string.isRequired,
  saveUrl: PropTypes.string.isRequired,
  selectedUSState: PropTypes.string,
  startSetPeople: PropTypes.func.isRequired,
  tempAddress: PropTypes.string,
  tempLat: PropTypes.number,
  tempLng: PropTypes.number,
  uid: PropTypes.string,
  userDisplayName: PropTypes.string,
};

MainForm.defaultProps = {
  selectedUSState: null,
  tempAddress: '',
  tempLat: 0,
  tempLng: 0,
  uid: null,
  userDisplayName: null,
};

const WrappedMainForm = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    const {
      currentTownHall,
      formKeys,
      displayValues,
    } = props;
    const townHallProps = mapValues(currentTownHall, value => (
      Form.createFormField({
        value,
      })
    ));
    const displayNames = mapValues(displayValues, value => (
      Form.createFormField({
        value,
      })
    ));
    return {
      ...townHallProps,
      ...displayNames,
      formKeys: Form.createFormField({
        value: formKeys,
      }),
    };
  },
  onValuesChange() {
    // console.log('values changed', values);
    // props.form.setFieldsValue(...values)
  },
})(MainForm);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedMainForm);
