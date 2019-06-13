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

import 'antd/dist/antd.less';

import {
  getTownHall,
} from '../../state/townhall/selectors';
import {
  getUserMOCs,
} from '../../state/user/selectors';
import selectionStateBranch from '../../state/selections';
import townHallStateBranch from '../../state/townhall';
import MainForm from '../MainForm';

import './style.scss';

const { Panel } = Collapse;

const noopFieldNames = ['displayName', 'address', 'preview'];

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
    this.resetAllData = this.resetAllData.bind(this);
    this.resetErrors = this.resetErrors.bind(this);
    this.setErrors = this.setErrors.bind(this);
    this.state = {
      displayValues: {},
      errors: null,
    };
  }

  setErrors(errors) {
    this.setState({ errors });
  }

  resetErrors() {
    this.setState({
      errors: null,
    });
  }

  resetAllData() {
    const {
      resetTownHallData,
      resetFormKeys,
      clearTempAddress,
    } = this.props;
    this.setState({
      displayValues: null,
      errors: null,
    });
    resetFormKeys();
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
    } = this.props;

    map(changedFields, (changedField) => {
      const {
        name,
        value,
      } = changedField;
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
      mocids
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
              mocids={mocids}
            />
          </Col>
          {
            this.props.mobile ? (
              <div></div>
            ) : (
              <Col md={0} lg={12}>
            <Affix>
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
  currentTownHall: getTownHall(state),
  mocids: getUserMOCs(state)
});

const mapDispatchToProps = dispatch => ({
  addDisclaimer: () => dispatch(townHallStateBranch.actions.addDisclaimer()),
  clearDisclaimer: () => dispatch(townHallStateBranch.actions.clearDisclaimer()),
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
  clearDisclaimer: PropTypes.func.isRequired,
  clearTempAddress: PropTypes.func.isRequired,
  currentTownHall: PropTypes.shape({}).isRequired,
  resetFormKeys: PropTypes.func.isRequired,
  resetTownHallData: PropTypes.func.isRequired,
  setMeetingType: PropTypes.func.isRequired,
  setNumberofKeys: PropTypes.func.isRequired,
  setUsState: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormController);
