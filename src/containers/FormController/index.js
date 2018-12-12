import React from 'react';
import PropTypes from 'prop-types';
import {
  includes,
  mapValues,
  map,
} from 'lodash';
import {
  connect,
} from 'react-redux';
import {
  Form,
  Row,
  Button,
  Input,
  Select,
  Checkbox,
  Col,
  Affix,
  Collapse,
} from 'antd';

import {
  disclaimerMeetingTypes,
} from '../../constants';
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

import 'antd/dist/antd.less';

import {
  getTownHall,
} from '../../state/townhall/selectors';
import {
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
  clearDisclaimer,
  resetTownHall,
} from '../../state/townhall/actions';
import MainForm from '../MainForm';

const FormItem = Form.Item;
const {
  Option,
} = Select;
const {
  TextArea,
} = Input;
const Panel = Collapse.Panel;

const customPanelStyle = {
    marginBottom: 24,
    border: 0,
};

import "./style.scss";

class FormController extends React.Component {
  static replacer(key, value) {
    // Filtering out properties
    if (!value || value.length === 0) {
      return undefined;
    }
    return value;
  }

  constructor(props) {
    super(props);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.state = {
      fields: {
        ...props.currentTownHall,
      },
    };
  }


  handleFormChange(changedFields) {
    const {
      addDisclaimer,
      setMeetingType,
      clearDisclaimer,
      setValue,
    } = this.props;
    map(changedFields, (changedField) => {
      const {
        name,
        value,
      } = changedField;
      if (name === 'meetingType' && value) {
        if (includes(disclaimerMeetingTypes, value)) {
          addDisclaimer();
        } else {
          clearDisclaimer();
        }
        setMeetingType(value);
      } else {
        setValue({
          key: name,
          value,
        });
      }
    });
  }

  render() {
    const {
      currentTownHall,
    } = this.props;
    return (
      <div>
        <Row gutter={24}>
          <Col span={12}>
            <MainForm
              onChange={this.handleFormChange}
              {...currentTownHall}
            />
          </Col>
          <Col span={8}>
            <Affix>
              <Collapse bordered={false}
                >
                <Panel 
                    style={customPanelStyle}
                    header="Data object"
                >
                  <pre className="language-bash" style={{overflow: 'visible'}}>
                    {
                      JSON.stringify(currentTownHall, FormController.replacer, 2)
                    }
                  </pre>
                </Panel>
            </Collapse>
            </Affix>
          </Col>
        </Row>


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
  clearDisclaimer: () => dispatch(clearDisclaimer()),
  geoCodeLocation: address => dispatch(lookUpAddress(address)),
  mergeNotes: () => dispatch(mergeNotes()),
  resetAllData: () => dispatch(resetTownHall()),
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

export default connect(mapStateToProps, mapDispatchToProps)(FormController);
