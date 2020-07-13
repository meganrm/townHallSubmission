import React from 'react';
import PropTypes from 'prop-types';
import {
  mapValues,
} from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Alert,
  BackTop,
  Form,
  Button,
  Input,
  Select,
  Checkbox,
  message,
} from 'antd';

import lawMakerStateBranch from '../../state/members-candidates';

import selectionStateBranch from '../../state/selections';

import {
  getUid,
  getUserName,
} from '../../state/user/selectors';
import MemberForm from '../../components/MemberForm';
import LocationForm from '../../components/LocationForm';
import DateTimeForm from '../../components/DateTimeForm';

// import 'antd/dist/antd.less';

import townHallStateBranch from '../../state/townhall';

import { formItemLayout } from '../../constants';
import AdditionalLinks from '../../components/AdditionalLinks';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

let initFieldValue;

const displaySuccessMessage = () => {
  message.success('Thanks for submitting info!', 4);
};

const displayErrorMessage = (error) => {
  message.error(`Something went wrong: ${error}`, 8);
};

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
    this.getError = this.getError.bind(this);
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

  getError(field) {
    const {
      errors,
    } = this.props;
    if (errors && errors[field]) {
      return errors[field].errors[0].message;
    }
    return false;
  }

  handleSubmit() {
    const {
      currentTownHall,
      saveUrl,
      submitMetaData,
      peopleDataUrl,
      mergeNotes,
      submitEventForReview,
      userDisplayName,
      uid,
    } = this.props;
    if (currentTownHall.meetingType === 'No Events') {
      const metaData = {
        eventId: currentTownHall.eventId,
        govtrack_id: currentTownHall.govtrack_id || null,
        memberId: currentTownHall.govtrack_id || currentTownHall.thp_id,
        mocDataPath: peopleDataUrl,
        thp_id: currentTownHall.thp_id || null,
        uid,
        userDisplayName,
      };
      submitMetaData(metaData)
        .then(() => {
          displaySuccessMessage();
        }).catch((error) => {
          displayErrorMessage(error);
        })
      return this.resetAll();
    }
    mergeNotes();
    const submit = {
      currentTownHall: {
        ...currentTownHall,
        // deleting fields that come from the antd components
        date: null,
        time: null,
        endTime: null,
        dateCreated: moment().format(),
        lastUpdated: Date.now(),
        enteredBy: uid,
      },
      saveUrl,
    };
    submitEventForReview(submit)
      .then(() => {

        displaySuccessMessage();
      })
      .catch(error => displayErrorMessage(error))
    return this.resetAll();
  }

  resetAll() {
    const {
      resetAllData,
    } = this.props;
    resetAllData();
    MainForm.scrollToTop();
  }

  checkSubmit(e) {
    e.preventDefault();
    const {
      setErrors,
      form,
    } = this.props;
    form.validateFieldsAndScroll((err) => {
      if (err) {
        setErrors(err);
        return console.log(err);
      }
      return this.handleSubmit();
    });
  }

  static renderErrors() {
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
      allNames,
      allPeople,
      clearSelectedMember,
      clearMemberCandidateMode,
      currentTownHall,
      eventTypeOptions,
      peopleDataUrl,
      personMode,
      peopleLookUpError,
      clearTempAddress,
      handleDatabaseLookupError,
      requestPersonDataById,
      requestAdditionalPersonDataById,
      togglePersonMode,
      selectedUSState,
      geoCodeLocation,
      resetDatabaseLookupError,
      requiredFields,
      setLatLng,
      setDate,
      setStartTime,
      selectedOfficePerson, 
      setDataFromPersonInDatabaseAction,
      setDataFromManualEnter,
      setUsState,
      setDistrict,
      setEndTime,
      tempAddress,
      tempLat,
      tempLng,
      tempStateName,
      tempState,
      setValue,
      errors,
      form,
      setIconFlag,
    } = this.props;
    const {
      getFieldDecorator,
      getFieldValue,
      getFieldsValue,
      setFieldsValue,
    } = form;

    return (
      <div className="new-event-form">
        <BackTop />
        {errors && MainForm.renderErrors()}
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
            requiredFields={requiredFields}
            currentTownHall={currentTownHall}
            setDataFromManualEnter={setDataFromManualEnter}
            setUsState={setUsState}
            setDistrict={setDistrict}
            selectedOfficePerson={selectedOfficePerson}
            peopleDataUrl={peopleDataUrl}
            setDataFromPersonInDatabaseAction={setDataFromPersonInDatabaseAction}
            requestPersonDataById={requestPersonDataById}
            requestAdditionalPersonDataById={requestAdditionalPersonDataById}
            selectedUSState={selectedUSState}
            togglePersonMode={togglePersonMode}
            getFieldDecorator={getFieldDecorator}
            personMode={personMode}
            setGenericTownHallValue={setValue}
            getFieldValue={getFieldValue}
            setFieldsValue={setFieldsValue}
            setIconFlag={setIconFlag}
            fields={getFieldsValue()}
            getError={this.getError}
            peopleLookUpError={peopleLookUpError}
            resetDatabaseLookUpError={resetDatabaseLookupError}
            handleDatabaseLookupError={handleDatabaseLookupError}
            clearSelectedMember={clearSelectedMember}
            clearMemberCandidateMode={clearMemberCandidateMode}
          />
          <section className="meeting information">
            <h4>
              Information about the Event
            </h4>
            {currentTownHall.meetingType !== 'No Events' && (
              <DateTimeForm
                setDate={setDate}
                setStartTime={setStartTime}
                setEndTime={setEndTime}
                getFieldDecorator={getFieldDecorator}
                getError={this.getError}
                requiredFields={requiredFields}
                townHallId={currentTownHall.eventId}
              />)}
            <FormItem>
              {getFieldDecorator('eventName', {
                initialValue: initFieldValue,
                trigger: 'onChange',
              })(
                <Input
                  className="input-underline"
                  placeholder="Name of the event"
                />,
              )}
            </FormItem>
            <FormItem
              label="Event type"
              validateStatus={this.getError('meetingType') ? 'error' : ''}
              help={this.getError('meetingType') || ''}
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
                  {eventTypeOptions.map((item, i) => {
                    return (
                    <Option value={item} key={i}>
                      {item}
                    </Option>
                    )
                  })}
                </Select>,
              )}
            </FormItem>
          </section>
          {currentTownHall.meetingType !== 'No Events' && (
            <LocationForm
              geoCodeLocation={geoCodeLocation}
              tempAddress={tempAddress}
              address={currentTownHall.address}
              clearTempAddress={clearTempAddress}
              tempLat={tempLat}
              tempLng={tempLng}
              tempStateInfo={{
                state: tempState,
                stateName: tempStateName,
              }}
              saveAddress={setLatLng}
              handleInputBlur={this.handleInputBlur}
              getFieldDecorator={getFieldDecorator}
              setFieldsValue={setFieldsValue}
              getFieldValue={getFieldValue}
              getError={this.getError}
              requiredFields={requiredFields}
            />
          )}

          {currentTownHall.meetingType !== 'No Events' && (

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
              <AdditionalLinks 
                form={form}
                currentTownHall={currentTownHall}
              />
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
                      <span style={{ fontSize: '13px' }}>Is the venue ADA accessible? (Please only select this if you can verify)</span>
                    </Checkbox>,
                  )}
              </FormItem>
              <FormItem
                label="Notes"
              >
                {getFieldDecorator('Notes', { initialValue: initFieldValue })(
                  <TextArea
                    rows={3}
                    placeholder="Notes about event that cannot be entered anywhere else."
                  />,
                )}
              </FormItem>
              <FormItem
                label="Internal Notes to THP Team"
              >
                {getFieldDecorator('internalNotes', {
                  initialValue: initFieldValue,
                })(
                  <TextArea
                    rows={3}
                    placeholder="Notes for Town Hall Project team."
                  />,
                )}
              </FormItem>
            </section>
          )}
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
  allNames: lawMakerStateBranch.selectors.getAllNames(state),
  allPeople: lawMakerStateBranch.selectors.getAllPeople(state),
  currentTownHall: townHallStateBranch.selectors.getTownHall(state),
  formKeys: selectionStateBranch.selectors.getFormKeys(state),
  eventTypeOptions: selectionStateBranch.selectors.getLawmakerTypeEventOptions(state),
  peopleDataUrl: selectionStateBranch.selectors.getPeopleDataUrl(state),
  peopleLookUpError: lawMakerStateBranch.selectors.getPeopleRequestError(state),
  peopleNameUrl: selectionStateBranch.selectors.getPeopleNameUrl(state),
  personMode: selectionStateBranch.selectors.getMode(state),
  requiredFields: townHallStateBranch.selectors.getRequiredFields(state),
  saveUrl: selectionStateBranch.selectors.getSaveUrl(state),
  selectedUSState: selectionStateBranch.selectors.getSelectedUSState(state),
  selectedOfficePerson: selectionStateBranch.selectors.getSelectedOfficePerson(state),
  tempAddress: selectionStateBranch.selectors.getTempAddress(state),
  tempLat: selectionStateBranch.selectors.getTempLat(state),
  tempLng: selectionStateBranch.selectors.getTempLng(state),
  tempState: selectionStateBranch.selectors.getTempState(state),
  tempStateName: selectionStateBranch.selectors.getTempStateName(state),
  uid: getUid(state),
  userDisplayName: getUserName(state),
});

const mapDispatchToProps = dispatch => ({
  addDisclaimer: () => dispatch(townHallStateBranch.actions.addDisclaimer()),
  clearTempAddress: () => dispatch(selectionStateBranch.actions.clearTempAddress()),
  clearSelectedMember: () => dispatch(selectionStateBranch.actions.clearSelectedMember()),
  clearMemberCandidateMode: () => dispatch(selectionStateBranch.actions.clearMemberCandidateMode()),
  geoCodeLocation: address => dispatch(selectionStateBranch.actions.lookUpAddress(address)),
  handleDatabaseLookupError: () => dispatch(lawMakerStateBranch.actions.databaseLookupError()),
  mergeNotes: () => dispatch(townHallStateBranch.actions.mergeNotes()),
  requestAdditionalPersonDataById: (peopleDataUrl, id, index) => dispatch(lawMakerStateBranch.actions.requestAdditionalPersonDataById(peopleDataUrl, id, index)),
  requestPersonDataById: (peopleDataUrl, id) => dispatch(lawMakerStateBranch.actions.requestPersonDataById(peopleDataUrl, id)),
  resetDatabaseLookupError: () => dispatch(lawMakerStateBranch.actions.resetDatabaseLookUpError()),
  setDataFromPersonInDatabaseAction: payload => dispatch(townHallStateBranch.actions.setDataFromPersonInDatabase(payload)),
  setDataFromManualEnter: payload => dispatch(townHallStateBranch.actions.setDataFromManualEnter(payload)),
  setDate: date => dispatch(townHallStateBranch.actions.setDate(date)),
  setUsState: state => dispatch(townHallStateBranch.actions.setUsState(state)),
  setDistrict: district => dispatch(townHallStateBranch.actions.setDistrict(district)),
  setEndTime: time => dispatch(townHallStateBranch.actions.setEndTime(time)),
  setIconFlag: payload => dispatch(townHallStateBranch.actions.setIconFlag(payload)),
  setLatLng: payload => dispatch(townHallStateBranch.actions.setLatLng(payload)),
  setMeetingType: payload => dispatch(townHallStateBranch.actions.setMeetingType(payload)),
  setStartTime: time => dispatch(townHallStateBranch.actions.setStartTime(time)),
  setTimeZone: payload => dispatch(townHallStateBranch.actions.getTimeZone(payload)),
  setValue: payload => dispatch(townHallStateBranch.actions.setValue(payload)),
  startSetPeople: peopleNameUrl => dispatch(lawMakerStateBranch.actions.requestNamesInCollection(peopleNameUrl)),
  submitEventForReview: payload => dispatch(townHallStateBranch.actions.submitEventForReview(payload)),
  submitMetaData: payload => dispatch(townHallStateBranch.actions.saveMetaData(payload)),
  togglePersonMode: mode => dispatch(selectionStateBranch.actions.toggleMemberCandidate(mode)),
});

MainForm.propTypes = {
  allNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  allPeople: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  clearTempAddress: PropTypes.func.isRequired,
  currentTownHall: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}),
  form: PropTypes.shape({}).isRequired,
  eventTypeOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  geoCodeLocation: PropTypes.func.isRequired,
  handleDatabaseLookupError: PropTypes.func.isRequired,
  mergeNotes: PropTypes.func.isRequired,
  peopleDataUrl: PropTypes.string.isRequired,
  peopleLookUpError: PropTypes.string,
  peopleNameUrl: PropTypes.string.isRequired,
  personMode: PropTypes.string.isRequired,
  requestAdditionalPersonDataById: PropTypes.func.isRequired,
  requestPersonDataById: PropTypes.func.isRequired,
  requiredFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  resetAllData: PropTypes.func.isRequired,
  resetDatabaseLookupError: PropTypes.func.isRequired,
  saveUrl: PropTypes.string.isRequired,
  selectedUSState: PropTypes.string,
  setDate: PropTypes.func.isRequired,
  setEndTime: PropTypes.func.isRequired,
  setErrors: PropTypes.func.isRequired,
  setLatLng: PropTypes.func.isRequired,
  setStartTime: PropTypes.func.isRequired,
  setTimeZone: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  startSetPeople: PropTypes.func.isRequired,
  submitEventForReview: PropTypes.func.isRequired,
  submitMetaData: PropTypes.func.isRequired,
  tempAddress: PropTypes.string,
  tempLat: PropTypes.number,
  tempLng: PropTypes.number,
  tempState: PropTypes.string,
  tempStateName: PropTypes.string,
  togglePersonMode: PropTypes.func.isRequired,
  uid: PropTypes.string,
  userDisplayName: PropTypes.string,
};

MainForm.defaultProps = {
  errors: null,
  peopleLookUpError: null,
  selectedUSState: null,
  tempAddress: '',
  tempLat: 0,
  tempLng: 0,
  tempState: '',
  tempStateName: '',
  uid: null,
  userDisplayName: null,
};

const WrappedMainForm = Form.create({
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
  onFieldsChange(props, changedFields) {
    const {
      onChange,
      resetErrors,
    } = props;
    resetErrors();
    onChange(changedFields);
  },
  onValuesChange() {
    // console.log('values changed', values);
    // props.form.setFieldsValue(...values)
  },
})(MainForm);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedMainForm);
