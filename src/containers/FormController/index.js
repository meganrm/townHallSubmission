import React from 'react';
import PropTypes from 'prop-types';
import {
  includes,
  map,
} from 'lodash';
import { moment } from 'moment';
import {
  connect,
} from 'react-redux';
import {
  Row,
  Col,
  Affix,
  Collapse,
} from 'antd';

import {
  disclaimerMeetingTypes,
} from '../../constants';

import 'antd/dist/antd.less';

import {
  getTownHall,
} from '../../state/townhall/selectors';
import selectionStateBranch from '../../state/selections';
import townHallStateBranch from '../../state/townhall';
import MainForm from '../MainForm';
import allTownHallsStateBranch from '../../state/alltownhalls';

import './style.scss';
import DupeDrawer from '../../components/DupeDrawer';

const { Panel } = Collapse;

const noopFieldNames = ['displayName', 'address', 'preview'];

const customPanelStyle = {
  border: 0,
  marginBottom: 24,
};


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
    this.resetAllData = this.resetAllData.bind(this);
    this.resetErrors = this.resetErrors.bind(this);
    this.setErrors = this.setErrors.bind(this);
    this.checkForDupes = this.checkForDupes.bind(this);
    this.state = {
      displayValues: {},
      dupes: [],
      errors: null,
      hasCheckedForDupes: false,
      dupeFieldsChanged: false,
    };
  }

  componentDidMount() {
    const {
      getAllEventToCheckDups,
      submissionUrl,
      liveUrl,

    } = this.props;
    getAllEventToCheckDups(liveUrl, submissionUrl);
  }

  componentDidUpdate(prevProps) {
    const {
      submissionUrl,
      liveUrl,
      getAllEventToCheckDups
    } = this.props;
    if (submissionUrl !== prevProps.submissionUrl) {
        getAllEventToCheckDups(liveUrl, submissionUrl);
    }
  }

  setErrors(errors) {
    this.setState({ errors });
  }

  resetErrors() {
    this.setState({
      errors: null,
    });
  }


  duplicateCheck(target, search) {
    const govId = 'govtrack_id';
    const displayName = 'displayName';
    const date = 'yearMonthDay';
    const time = 'timeStart24';
    let dupe = false;
    let match = false;
    if (Object.keys(target).includes(govId)) {
      if (target[govId] == search[govId]) {
        match = true;
      }
    } else if (target[displayName] == search[displayName]) {
      match = true;
    }
    if (match && (target[date] == search[date] && target[time] == search[time])) {
      dupe = true;
    }
    return (dupe);
  }

  checkForDupes(currentEvent) {
    const {
      allTownHalls,
    } = this.props;
    return allTownHalls.filter(townhall => this.duplicateCheck(currentEvent, townhall));
  }

  resetAllData() {
    const {
      resetTownHallData,
      resetFormKeys,
      clearTempAddress,
      clearMemberCandidateMode,
    } = this.props;
    this.setState({
      displayValues: null,
      errors: null,
    });
    resetFormKeys();
    clearMemberCandidateMode();
    clearTempAddress();
    resetTownHallData();
  }

  handleFormChange(changedFields) {
    const {
      displayValues,
    } = this.state;
    const {
      addDisclaimer,
      setMeetingType,
      clearDisclaimer,
      setValue,
      setUsState,
      setNumberofKeys,
      currentTownHall,
    } = this.props;

    const dupCheckFields = ['time', 'date', 'yearMonthDay', 'timeStart24', 'govtrack_id', 'displayName'];
    map(changedFields, (changedField) => {
      const {
        name,
        value,
      } = changedField;
      let newValue = value;
      let newName = name;
      if (name === 'time' && value) {
        newName = 'timeStart24'
        newValue = value.format('HH:mm:00')
      }
      if (name === 'date' && value) {
        newName = 'yearMonthDay';
        newValue = value.format('YYYY-MM-DD');
      }
      const mergedEvent = {
        yearMonthDay: currentTownHall.yearMonthDay,
        timeStart24: currentTownHall.timeStart24,
        displayName: currentTownHall.displayName,
        govtrack_id: currentTownHall.govtrack_id,
        [newName]: newValue,
      };
      const hasAllFields = mergedEvent => !!mergedEvent.yearMonthDay && !!mergedEvent.timeStart24 && !!(mergedEvent.govtrack_id || mergedEvent.displayName);
      // if change any of the dup check fields, set back to false
      if (dupCheckFields.includes(name) && this.state.hasCheckedForDupes) {
        this.setState({ hasCheckedForDupes: false })
      }
      // only check once, and only when all the fields are there
      if (!this.state.hasCheckedForDupes && hasAllFields(mergedEvent)) {
        console.log('checking for dups');
        const dupes = this.checkForDupes(mergedEvent);
        console.log(dupes);
        this.setState({
          dupes,
          hasCheckedForDupes: true,
        });
      }
      if (includes(noopFieldNames, name) || includes(noopFieldNames, name.split('-')[0])) {
        this.setState({
          displayValues: {
            ...displayValues,
            [name]: value,
          },
        });
        return;
      }
      switch (name) {
      case 'formKeys':
        setNumberofKeys(value);
        break;
      case 'meetingType':
        if (includes(disclaimerMeetingTypes, value)) {
          addDisclaimer();
        } else {
          clearDisclaimer();
        }
        setMeetingType(value);
        break;
      case 'state':
        setUsState(value);
        break;
      default:
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
      mobile,
    } = this.props;
    const {
      displayValues,
      errors,
    } = this.state;
    return (
      <div className="form-container">

        <Row>
          <Col md={24} lg={12}>
            <MainForm
              displayValues={displayValues}
              onChange={this.handleFormChange}
              resetAllData={this.resetAllData}
              errors={errors}
              resetErrors={this.resetErrors}
              setErrors={this.setErrors}
            />
          </Col>
          {
            mobile ? (
              <div />
            ) : (
              <Col md={0} lg={12}>
                <Affix>
                  <DupeDrawer
                    dupes={this.state.dupes}
                    resetAllData={this.resetAllData}
                  />
                  <Collapse bordered={false}>
                    <Panel
                      style={customPanelStyle}
                      header="Data object (click to see data you've entered)"
                    >
                      <pre className="language-bash" style={{ overflow: 'visible' }}>
                        {
                          JSON.stringify(currentTownHall, FormController.replacer, 2)
                        }
                      </pre>
                    </Panel>
                  </Collapse>
                </Affix>
              </Col>
            )
          }
        </Row>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  allTownHalls: allTownHallsStateBranch.selectors.getSubmittedandApprovedTownHalls(state),
  submissionUrl: selectionStateBranch.selectors.getSaveUrl(state),
  liveUrl: selectionStateBranch.selectors.getLiveUrl(state),
  currentTownHall: getTownHall(state),
});

const mapDispatchToProps = dispatch => ({
  addDisclaimer: () => dispatch(townHallStateBranch.actions.addDisclaimer()),
  getAllEventToCheckDups: (liveUrl, submissionUrl) => dispatch(allTownHallsStateBranch.actions.getAllEventToCheckDups(liveUrl, submissionUrl)),
  clearDisclaimer: () => dispatch(townHallStateBranch.actions.clearDisclaimer()),
  clearMemberCandidateMode: () => dispatch(selectionStateBranch.actions.clearMemberCandidateMode()),
  clearTempAddress: () => dispatch(selectionStateBranch.actions.clearTempAddress()),
  resetFormKeys: () => dispatch(selectionStateBranch.actions.resetFormKeys()),
  resetTownHallData: () => dispatch(townHallStateBranch.actions.resetTownHall()),
  setMeetingType: payload => dispatch(townHallStateBranch.actions.setMeetingType(payload)),
  setNumberofKeys: payload => dispatch(selectionStateBranch.actions.setFormKeys(payload)),
  setUsState: payload => dispatch(townHallStateBranch.actions.setUsState(payload)),
  setValue: payload => dispatch(townHallStateBranch.actions.setValue(payload)),
});

FormController.propTypes = {
  addDisclaimer: PropTypes.func.isRequired,
  allTownHalls: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  clearDisclaimer: PropTypes.func.isRequired,
  clearTempAddress: PropTypes.func.isRequired,
  currentTownHall: PropTypes.shape({}).isRequired,
  mobile: PropTypes.bool.isRequired,
  resetFormKeys: PropTypes.func.isRequired,
  resetTownHallData: PropTypes.func.isRequired,
  setMeetingType: PropTypes.func.isRequired,
  setNumberofKeys: PropTypes.func.isRequired,
  setUsState: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormController);
