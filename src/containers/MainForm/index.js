import React from 'react';
import PropTypes from 'prop-types';
import {
  includes,
  mapValues,
} from 'lodash';
import { connect } from 'react-redux';
import {
  Form,
  Button,
  Input,
  Select,
  Checkbox,
} from 'antd';

import { disclaimerMeetingTypes } from '../../constants';
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
import { toggleMemberCandidate, lookUpAddress } from '../../state/selections/actions';
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

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

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

  constructor(props) {
    super(props);
    this.handleMeetingChange = this.handleMeetingChange.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.onCheckBoxChecked = this.onCheckBoxChecked.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkSubmit = this.checkSubmit.bind(this);
  }

  componentWillMount() {
    const {
      startSetPeople,
      peopleNameUrl,
    } = this.props;
    startSetPeople(peopleNameUrl);
  }


  componentWillReceiveProps(nextProps) {
    const {
      startSetPeople,
      peopleNameUrl,
      currentTownHall,
      form,
    } = this.props;
    if (peopleNameUrl !== nextProps.peopleNameUrl) {
      startSetPeople(nextProps.peopleNameUrl);
    }
    // this.setState({...nextProps.currentTownHall})
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
    this.props.form.validateFieldsAndScroll(['meetingType'], (err, values) => {
      if (err) {
        return console.log(err);
      }
      this.handleSubmit();
    });
  }

  handleSubmit() {
    const {
      currentTownHall,
      saveUrl,
      submitMetaData,
      peopleDataUrl,
      mergeNotes,
      updateUserSubmission,
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
    console.log(saveUrl);
    const submit = {
      currentTownHall: {
        ...currentTownHall,
        lastUpdated: Date.now(),
        enteredBy: uid,
      },
      metaData,
      saveUrl,
    };
    submitEventForReview(submit);
    console.log('before reset', this.props.form.getFieldsValue());
    this.props.form.resetFields();
    console.log('after reset', this.props.form.getFieldsValue());
  }

  onCheckBoxChecked(e) {
    const { setValue } = this.props;
    setValue({ key: e.target.id, value: e.target.checked });
  }

  handleInputBlur(e) {
    console.log(e.target);
    const { setValue } = this.props;
    setValue({ key: e.target.id, value: e.target.value });
  }

  handleMeetingChange(value) {
    const {
      addDisclaimer,
      setMeetingType,
    } = this.props;
    if (includes(disclaimerMeetingTypes, value)) {
      addDisclaimer();
    }
    setMeetingType(value);
  }

  render() {
    const {
      allNames,
      allPeople,
      currentTownHall,
      peopleDataUrl,
      personMode,
      requestPersonDataById,
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
    } = this.props;
    const {
      getFieldDecorator,
      getFieldValue,
      getFieldsValue,
      setFieldsValue,
      resetFields,
    } = this.props.form;
    return (
      <div className="new-event-form">
        <Form
          onSubmit={this.checkSubmit}
          onChange={this.handleFormChange}
          id="new-event-form-element"
          layout="horizontal"
        >
          <Button
            onClick={resetFields()}
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
            getFieldValue={getFieldValue}
            setFieldsValue={setFieldsValue}
            fields={getFieldsValue()}
          />
          <section className="meeting infomation">
            <h4>
              Information about the Event
            </h4>
            <FormItem>
              {getFieldDecorator('eventName')(
                <Input
                  type="text"
                  className="input-underline"
                  id="eventName"
                  placeholder="Name of the event"
                  onBlur={this.handleInputBlur}
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('meetingType', {
                rules: [{ required: true, message: 'Please select type of event' }],
              })(

                <Select
                  onChange={this.handleMeetingChange}
                  key="meetingType"
                  placeholder="Meeting type"
                >
                  <Option value="Town Hall">
                  Town Hall
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
            tempLat={tempLat}
            tempLng={tempLng}
            tempStateInfo={{ stateName: tempStateName, state: tempState }}
            saveAddress={setLatLng}
            handleInputBlur={this.handleInputBlur}
            getFieldDecorator={getFieldDecorator}
          />
          <DateTimeForm
            setDate={setDate}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
            getFieldDecorator={getFieldDecorator}

          />
          <section className="extra-data event-details">
            <h4>
              Additional information
            </h4>
            <FormItem>
              <label htmlFor="link">
                URL related to event (optional)
              </label>
              {getFieldDecorator('link')(

                <Input
                  type="url"
                  className="input-underline"
                  id="link"
                  placeholder="Link"
                  onBlur={this.handleInputBlur}
                  onChange={this.handleChange}
                />,
              )}
            </FormItem>
            <FormItem>
              <label htmlFor="linkName">
                Link display name (optional)
              </label>
              {getFieldDecorator('linkName')(
                <Input
                  type="text"
                  className="input-underline"
                  id="linkName"
                  placeholder="Link Name"
                  onBlur={this.handleInputBlur}
                />,
              )}
            </FormItem>
            <FormItem>
              <Checkbox
                type="checkbox"
                class="general-checkbox"
                id="ada_accessible"
                onChange={this.onCheckBoxChecked}
              >
              ADA accessible?
              </Checkbox>
            </FormItem>
            <FormItem>
              <label htmlFor="Notes">
              Public Notes
              </label>
              {getFieldDecorator('Notes')(
                <TextArea
                  id="Notes"
                  rows={3}
                  placeholder="Notes about event that cannot be entered anywhere else."
                  onBlur={this.handleInputBlur}
                />,
              )}
            </FormItem>
            <FormItem>
              <label htmlFor="Internal-Notes">
              Internal Notes to THP Team
              </label>
              {getFieldDecorator('Internal-Notes')(
                <TextArea
                  rows={3}
                  id="Internal-Notes"
                  placeholder="Notes for Town Hall Project team."
                  onBlur={this.handleInputBlur}
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
  geoCodeLocation: address => dispatch(lookUpAddress(address)),
  mergeNotes: () => dispatch(mergeNotes()),
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
  startSetPeople: PropTypes.func.isRequired,
  allNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  allPeople: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentTownHall: PropTypes.shape({}).isRequired,
  peopleDataUrl: PropTypes.string.isRequired,
  peopleNameUrl: PropTypes.string.isRequired,
  personMode: PropTypes.string.isRequired,
  saveUrl: PropTypes.string.isRequired,
  selectedUSState: PropTypes.string,
  tempAddress: PropTypes.string,
  tempLat: PropTypes.number,
  tempLng: PropTypes.number,
  uid: PropTypes.string.isRequired,
  userDisplayName: PropTypes.string.isRequired,
};

MainForm.defaultProps = {
  selectedUSState: null,
  tempAddress: '',
  tempLat: 0,
  tempLng: 0,
};

const WrappedMainForm = Form.create({
  onFieldsChange(props, changedFields) {
    console.log('changed fields', changedFields)
    props.onChange(changedFields)
  },
  mapPropsToFields(props) {
    const { currentTownHall } = props;
    return mapValues(currentTownHall, value => (
      Form.createFormField({
        value,
      })
    ));
  },
  onValuesChange(_, values) {
    console.log('values changed', values);
  },
})(MainForm);


export default connect(mapStateToProps, mapDispatchToProps)(WrappedMainForm);
