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
} from '../../state/selections/actions';
import {
  addDisclaimer,
  setMeetingType,
  setValue,
  clearDisclaimer,
  resetTownHall,
} from '../../state/townhall/actions';
import MainForm from '../MainForm';

import './style.scss';

const Panel = Collapse.Panel;

const noopFieldNames = ['displayName', 'address'];

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
      },
    };
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
      if (includes(noopFieldNames, name) || name.split('-')[0] === 'preview') {
        return;
      }
      switch (name) {
      case 'keys':
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
