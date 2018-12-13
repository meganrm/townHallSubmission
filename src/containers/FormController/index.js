import React from 'react';
import PropTypes from 'prop-types';
import {
  includes,
  map,
} from 'lodash';
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
import {
  startSetPeople,
  requestPersonDataById,
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
  setFormKeys,
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

import "./style.scss";

const Panel = Collapse.Panel;

const customPanelStyle = {
    marginBottom: 24,
    border: 0,
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
    this.state = {
        fields: {
            ...props.currentTownHall,
        }
    }
  }


  handleFormChange(changedFields) {
    const {
      addDisclaimer,
      setMeetingType,
      clearDisclaimer,
      setValue,
      setNumberofKeys,
    } = this.props;
    console.log('fields changed', changedFields);
    map(changedFields, (changedField) => {
      const {
        name,
        value,
      } = changedField;
      if (name === 'displayName' || name.split('-')[0] === 'preview') {
          return;
      }
      if (name === 'keys') {
          setNumberofKeys(value);
      }
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
            />
          </Col>
          <Col span={8}>
            <Affix>
              <Collapse bordered={false}>
                <Panel
                  style={customPanelStyle}
                  header="Data object"
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
        </Row>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  currentTownHall: getTownHall(state),
});

const mapDispatchToProps = dispatch => ({
  addDisclaimer: () => dispatch(addDisclaimer()),
  clearDisclaimer: () => dispatch(clearDisclaimer()),
  resetAllData: () => dispatch(resetTownHall()),
  setMeetingType: payload => dispatch(setMeetingType(payload)),
  setValue: payload => dispatch(setValue(payload)),
  setNumberofKeys: payload => dispatch(setFormKeys(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormController);
