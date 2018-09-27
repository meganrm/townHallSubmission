import React from 'react';
import { connect } from 'react-redux';
import {
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
import {
  getPeopleNameUrl,
  getPeopleDataUrl,
  getSaveUrl,
  getSelectedUSState,
  getTempAddress,
  getTempLat,
  getTempLng,
  getMode,
} from '../../state/selections/selectors';
import {
  getUid,
  getUserEmail,
  getUserName,
} from '../../state/user/selectors';
import MemberForm from '../../components/MemberForm';
import LocationForm from '../../components/LocationForm';
import DateTimeForm from '../../components/DateTimeForm';

import 'antd/dist/antd.less';

import { getTownHall } from '../../state/townhall/selectors';
import { toggleMemberCandidate, lookUpAddress } from '../../state/selections/actions';
import {
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
      &&      (currentTownHall.yearMonthDay !== nextTownHall.yearMonthDay
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
    this.handleChange = this.handleChange.bind(this);
    this.state = { ...props.currentTownHall }
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
    } = this.props;
    if (peopleNameUrl !== nextProps.peopleNameUrl) {
      startSetPeople(nextProps.peopleNameUrl);
    }
    // this.setState({ ...currentTownHall });
  }

  componentDidUpdate(prevProps) {
    const {
      currentTownHall,
      setTimeZone,
    } = this.props;
    if (MainForm.shouldGetLatLng(prevProps.currentTownHall, currentTownHall)) {
      console.log('getting zone');
      setTimeZone({
        date: currentTownHall.dateString,
        time: currentTownHall.Time,
        lat: currentTownHall.lat,
        lng: currentTownHall.lng,
      });
    }
  }

  handleChange(e) {
    // this.setState({[e.target.id]: event.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
    const {
      currentTownHall,
      saveUrl,
      submitMetaData,
      peopleDataUrl,
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

    console.log(saveUrl);
    const submit = {
      currentTownHall: {
        ...currentTownHall,
        lastUpdated: Date.now(),
        enteredBy: uid,
      },
      saveUrl,
      metaData,
    };
    submitEventForReview(submit);
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
      setMeetingType,
    } = this.props;
    console.log(value);
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
    } = this.props;
    const {
      getFieldDecorator,
      getFieldValue,
      setFieldsValue,
    } = this.props.form;
    return (
      <div className="new-event-form">
        <Form
          onSubmit={this.handleSubmit}
          id="new-event-form-element"
          layout="horizontal"
        >
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
          />
          <section className="meeting infomation">
            <h4>
              Information about the Event
            </h4>
            <FormItem>
              <Input
                type="text"
                className="input-underline"
                id="eventName"
                placeholder="Name of the event"
                onBlur={this.handleInputBlur}
              />
            </FormItem>
            <FormItem>
              {getFieldDecorator('meetingType', {
                rules: [{ required: true, message: 'Please select type of event', initialValue: null }],
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
              <Input
                type="url"
                class="input-underline"
                id="link"
                placeholder="Link"
                onBlur={this.handleInputBlur}
                onChange={this.handleChange}
              />
            </FormItem>
            <FormItem>
              <label htmlFor="linkName">
                Link display name (optional)
              </label>
              <Input
                type="text"
                class="input-underline"
                id="linkName"
                placeholder="Link Name"
                onBlur={this.handleInputBlur}
                onChange={this.handleChange}
              />
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
              <TextArea
                id="Notes"
                rows={3}
                placeholder="Notes about event that cannot be entered anywhere else."
                onBlur={this.handleInputBlur}
                onChange={this.handleChange}
              />
            </FormItem>
            <FormItem>
              <label htmlFor="Internal-Notes">
              Internal Notes to THP Team
              </label>
              <TextArea
                rows={3}
                id="Internal-Notes"
                placeholder="Notes for Town Hall Project team."
                onBlur={this.handleInputBlur}
                onChange={this.handleChange}
              />
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
  peopleDataUrl: getPeopleDataUrl(state),
  peopleNameUrl: getPeopleNameUrl(state),
  personMode: getMode(state),
  saveUrl: getSaveUrl(state),
  selectedUSState: getSelectedUSState(state),
  tempAddress: getTempAddress(state),
  tempLat: getTempLat(state),
  tempLng: getTempLng(state),
  uid: getUid(state),
  userDisplayName: getUserName(state),
});

const mapDispatchToProps = dispatch => ({
  geoCodeLocation: address => dispatch(lookUpAddress(address)),
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

const WrappedMainForm = Form.create()(MainForm);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedMainForm);
