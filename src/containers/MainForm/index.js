import React from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Input,
  Select,
} from 'antd';

import {
  startSetPeople,
  requestPersonDataById,
} from '../../state/members-candidates/actions';

import {
  getAllNames,
  getAllPeople,
} from '../../state/members-candidates/selectors';
import {
  getPeopleNameUrl,
  getPeopleDataUrl,
  getSelectedUSState,
  getTempAddress,
  getTempLat,
  getTempLng,
} from '../../state/selections/selectors';

import MemberForm from '../../components/MemberForm';
import LocationForm from '../../components/LocationForm';
import DateTimeForm from '../../components/DateTimeForm';

import 'antd/dist/antd.css';

import { getTownHall } from '../../state/townhall/selectors';
import { toggleMemberCandidate, lookUpAddress } from '../../state/selections/actions';
import {
  setLatLng,
  setDate,
  setStartTime,
  setEndTime,
  getTimeZone,
} from '../../state/townhall/actions';

const FormItem = Form.Item;
const { Option } = Select;

class MainForm extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {
      startSetPeople,
      peopleNameUrl,
    } = this.props;
    startSetPeople(peopleNameUrl);
  }

  static shouldGetLatLng(currentTownHall, nextTownHall) {
    console.log(
      currentTownHall.yearMonthDay,
      currentTownHall.Time,
      currentTownHall.lat,
      nextTownHall.yearMonthDay,
      nextTownHall.Time,
      nextTownHall.lat,
    )
    if (
      (nextTownHall.yearMonthDay &&
      nextTownHall.Time &&
      nextTownHall.lat)
      &&
      (currentTownHall.yearMonthDay !== nextTownHall.yearMonthDay ||
      currentTownHall.Time !== nextTownHall.Time ||
      currentTownHall.timeEnd !== nextTownHall.timeEnd ||
      currentTownHall.lat !== nextTownHall.lat)
    ) {
      return true;
    }
    return false;
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

  componentDidUpdate(prevProps){
    const {
      currentTownHall,
      setTimeZone,
    } = this.props;
    if (MainForm.shouldGetLatLng(prevProps.currentTownHall, currentTownHall)) {
      console.log('getting zone')
      setTimeZone({
        date: currentTownHall.dateString,
        time: currentTownHall.Time,
        lat: currentTownHall.lat,
        lng: currentTownHall.lng,
      });
    }
  }



  render() {
    const { 
      allNames, 
      allPeople,
      currentTownHall,
      peopleDataUrl,
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
    } = this.props.form;
    return (
      <div class="new-event-form col-md-9">
        <h3 className="text-success">Enter a new town hall event</h3>
        <Form
          id="new-event-form-element"
          layout="horizontal"
        >
          <MemberForm
            allNames={allNames}
            allPeople={allPeople}
            currentTownHall={currentTownHall}
            peopleDataUrl={peopleDataUrl}
            requestPersonDataById={requestPersonDataById}
            selectedUSState={selectedUSState}
            togglePersonMode={togglePersonMode}
            getFieldDecorator={getFieldDecorator}
          />
          <section class="meeting infomation">
            <h4 class="text-info">
              Information about the Event
            </h4>
            <div class="form-group col-sm-12">
              <Input type="text" class="form-control input-underline" id="eventName" value={currentTownHall.eventName || ''} placeholder="Name of the event" />
            </div>
            <FormItem>
              <Select>
                <Option value="Town Hall">Town Hall</Option>
                <Option value="Tele-Town Hall">Tele-Town Hall</Option>
                <Option value="Ticketed Event">Ticketed Event</Option>
                <Option value="Campaign Town Hall">Campaign Town Hall</Option>
                <Option value="Adopt-A-District/State">Adopt-A-District/State</Option>
                <Option value="Empty Chair Town Hall">Empty Chair Town Hall</Option>
                <Option value="Hearing">Hearing</Option>
                <Option value="DC Event">DC Event</Option>
                <Option value="Office Hours">Office Hours</Option>
                <Option value="Other">Other</Option>
                <Option className="text-secondary" value="No Events">No new events</Option>
              </Select>
              <span id="meetingType-error" class="help-block error-message hidden">Please select type of event</span>
            </FormItem>
          </section>
          <LocationForm 
            geoCodeLocation={geoCodeLocation}
            tempAddress={tempAddress}
            tempLat={tempLat}
            tempLng={tempLng}
            saveAddress={setLatLng}
          />
          <DateTimeForm 
            setDate={setDate}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
          />
          <section class="extra-data event-details">
            <div class="form-group col-sm-12">
              <label for="link">URL related to event (optional)</label>
              <input type="url" class="form-control input-underline" id="link" placeholder="Link" value="" />
            </div>
            <div class="form-group col-sm-12">
              <label  for="linkName">Link display name (optional)</label>
              <input type="text" class="form-control input-underline" id="linkName" placeholder="Link Name" value="" />
            </div>
            <div class="checkbox col-sm-12">
              <label>
                <input type="checkbox" class="general-checkbox" id="ada_accessible" />
                <span class="checkbox-label">ADA accessible?</span>
              </label>
            </div>
            <div class="row">
              <div class="col-sm-8">
                <div class="form-group col-sm-12">
                  <label for="Notes">Public Notes</label>
                  <textarea class="form-control" id="Notes" placeholder="Notes about event that cannot be entered anywhere else." rows="3"></textarea>
                </div>
                <div class="form-group col-sm-12">
                  <label for="Internal-Notes">Internal Notes to THP Team</label>
                  <textarea class="form-control" id="Internal-Notes" placeholder="Notes for Town Hall Project team." rows="3"></textarea>
                </div>
              </div>
            </div>
          </section>
          <button class="btn btn-default btn-secondary" type="submit" name="button">Submit</button>
          <span id="general-error" class="help-block error-message hidden"></span>
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
  selectedUSState: getSelectedUSState(state),
  tempAddress: getTempAddress(state),
  tempLat: getTempLat(state),
  tempLng: getTempLng(state),
});

const mapDispatchToProps = dispatch => ({
  geoCodeLocation: address => dispatch(lookUpAddress(address)),
  requestPersonDataById: (peopleDataUrl, id) => dispatch(requestPersonDataById(peopleDataUrl, id)),
  setDate: date => dispatch(setDate(date)),
  setEndTime: time => dispatch(setEndTime(time)),
  setLatLng: payload => dispatch(setLatLng(payload)),
  setStartTime: time => dispatch(setStartTime(time)),
  setTimeZone: payload => dispatch(getTimeZone(payload)),
  startSetPeople: peopleNameUrl => dispatch(startSetPeople(peopleNameUrl)),
  togglePersonMode: mode => dispatch(toggleMemberCandidate(mode)),
});

const WrappedMainForm = Form.create()(MainForm);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedMainForm);
