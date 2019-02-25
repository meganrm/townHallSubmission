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
  setFormKeys,
  resetFormKeys,
} from '../../state/selections/actions';
import {
  addDisclaimer,
  setMeetingType,
  setValue,
  clearDisclaimer,
  resetTownHall,
  setUsState,
} from '../../state/townhall/actions';
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
    this.state = {
      displayValues: {},
    };
  }

  resetAllData() {
    const {
      resetAllData,
      resetFormKeys
    } = this.props;
    this.setState({ displayValues: null });
    resetFormKeys();
    resetAllData();
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
    } = this.props;
    const {
      displayValues,
    } = this.state;
    return (
      <div className="form-container">
        <Row gutter={8}>
          <Col span={12}>
            <MainForm
              displayValues={displayValues}
              onChange={this.handleFormChange}
              resetAllData={this.resetAllData}
            />
          </Col>
          <Col span={12}>
            <Affix>
              <Collapse bordered={false}>
                <Panel
                  style={customPanelStyle}
                  header="Data object (click to see data you've entered"
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
  resetFormKeys: () => dispatch(resetFormKeys()),
  setMeetingType: payload => dispatch(setMeetingType(payload)),
  setNumberofKeys: payload => dispatch(setFormKeys(payload)),
  setUsState: payload => dispatch(setUsState(payload)),
  setValue: payload => dispatch(setValue(payload)),
});

FormController.propTypes = {
  addDisclaimer: PropTypes.func.isRequired,
  clearDisclaimer: PropTypes.func.isRequired,
  setMeetingType: PropTypes.func.isRequired,
  setNumberofKeys: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormController);
