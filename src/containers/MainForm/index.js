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
} from '../../state/selections/selectors';

import MemberForm from '../../components/MemberForm';

import 'antd/dist/antd.css';

import { getTownHall } from '../../state/townhall/selectors';
import { toggleMemberCandidate } from '../../state/selections/actions';

const FormItem = Form.Item;
const { Option } = Select;

class MainForm extends React.Component {

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
        } = this.props;
        if (peopleNameUrl !== nextProps.peopleNameUrl){
          startSetPeople(nextProps.peopleNameUrl);
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
        } = this.props;
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
                  />
              <section class="meeting infomation">
                <h4 class="text-info">Information about the Event</h4>
                <div class="form-group col-sm-12">
                      <Input type="text" class="form-control input-underline" id="eventName" value="" placeholder="Name of the event" />
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
              <section class="adopter-data non-standard hidden">
                <div class="form-group col-sm-12" id="adopter-member-form-group">
                      <label for="districtAdopter">MOC appearing at event (adopter)</label>
                      <input type="text" class="form-control input-underline" id="districtAdopter" placeholder="Full name" value="" autocomplete="off" />
                      <span id="adopter-member-help-block" class="help-block">Only first name and last name, not titles</span>
                </div>
              </section>
              <section class="location-data event-details">
                <div class="form-group col-sm-12 general-inputs">
                      <label class="sr-only" for="Location">Location</label>
                      <input type="text" class="form-control input-underline" id="Location" placeholder="Name of location (eg. Gary Recreation Center)" value="" />
                    </div>
                <div class="form-group col-sm-12 general-inputs" id="location-form-group">
                      <input type="text" class="form-control" placeholder="Street address" id="address" />
                      <span id="address-feedback" class="help-block">Enter a valid street address, if there isn't one, leave this blank</span>
                    </div>
                <div class="form-group col-sm-12 general-inputs">
                      <label class="sr-only" for="addressType">Address Type</label>
                      <input class="sr-only" type="text" class="" id="addressType" placeholder="Address type" value="street" readonly />
                    </div>
                <div class="form-group col-sm-12 general-inputs">
                      <label class="sr-only" for="locationCheck">Location Check</label>
                      <input class="sr-only" type="text" class="text-success" id="locationCheck" placeholder="please geocode" readonly />
                    </div>
                <div class="text-info non-standard tele-inputs hidden">
                      <div class="form-group col-sm-12">
                        <label class="" for="phoneNumber">Phone Number format: (555) 555-5555</label>
                        <input type="tel" class="form-control" id="phoneNumber" placeholder="Phone Number" value="" />
                        <span id="phoneNumber-error" class="help-block error-message hidden">Please enter a valid phone number</span>
                      </div>
                      <div class="form-group">
                        <label class="sr-only" for="addressType">Address Type</label>
                        <input type="text" class="sr-only" id="addressType" placeholder="Address type" value="state" readonly />
                      </div>
                      <div class="form-group">
                        <label class="sr-only" for="locationCheck">Location Check</label>
                        <input type="text" class="text-success sr-only" id="locationCheck" placeholder="please geocode" readonly />
                      </div>
                    </div>
              </section>
              <section class="time-data event-details">
                <div class="checkbox col-sm-12">
                      <label>
                        <input type="checkbox" class="date-string" />
                        <span class="checkbox-label">Click for repeating event (eg. 'First Wed')</span>
                      </label>
                    </div>
                <div class="form-group col-sm-12">
                      <label  for="yearMonthDay">Date</label>
                      <input type="date" class="form-control datetime date " id="yearMonthDay" placeholder="MM/DD/YYYY" />
                      <span id="yearMonthDay-error" class="help-block error-message hidden">Please enter a valid date</span>
                    </div>
                <div class="form-group hidden repeating">
                      <label  for="repeatingString">Repeating Event</label>
                      <input type="text" class="form-control input-underline " id="repeatingEvent" placeholder="Eg. First Tuesday of the month" />
                    </div>
                <div class="form-group col-sm-6">
                      <label for="Time">Start Time (HH:MM AM/PM)</label>
                      <input type="time" class="form-control datetime " id="timeStart24" placeholder="HH:MM AM/PM" />
                      <span id="timeStart24-error" class="help-block error-message hidden">Please enter a valid time</span>
                    </div>
                <div class="form-group col-sm-6">
                      <label for="endTime">End Time (HH:MM AM/PM)</label>
                      <input type="time" class="form-control datetime " id="timeEnd24" placeholder="HH:MM AM/PM" />
                    </div>
              </section>
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
        )
    }
}

const mapStateToProps = state => ({
    allNames: getAllNames(state),
    allPeople: getAllPeople(state),
    peopleNameUrl: getPeopleNameUrl(state),
    peopleDataUrl: getPeopleDataUrl(state),
    currentTownHall: getTownHall(state),
    selectedUSState: getSelectedUSState(state),
});

const mapDispatchToProps = dispatch => ({
    requestPersonDataById: (peopleDataUrl, id) => dispatch(requestPersonDataById(peopleDataUrl, id)),
    startSetPeople: peopleNameUrl => dispatch(startSetPeople(peopleNameUrl)),
    togglePersonMode: mode => dispatch(toggleMemberCandidate(mode))
});

export default connect(mapStateToProps, mapDispatchToProps)(MainForm);
