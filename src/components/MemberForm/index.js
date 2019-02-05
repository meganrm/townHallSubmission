import React from 'react';
import PropTypes from 'prop-types';

import {
  AutoComplete,
  Input,
  Form,
  Radio,
  Icon,
  Button,
} from 'antd';
import { find } from 'lodash';
import renderCustomPersonForm from './customMemberForm';

import './style.scss';
import { MOC_MODE, CANDIDATE_MODE, MANUAL_MODE } from '../../constants';

const FormItem = Form.Item;

let uuid = 1;

class MemberLookup extends React.Component {
  constructor(props) {
    super(props);
    this.onNameSelect = this.onNameSelect.bind(this);
    this.formatDistrict = this.formatDistrict.bind(this);
    this.renderDatabaseLookupForm = this.renderDatabaseLookupForm.bind(this);
    this.memberForms = this.memberForms.bind(this);
    this.addMember = this.addMember.bind(this);
    this.removeAdditionalMember = this.removeAdditionalMember.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {
      currentTownHall,
      setFieldsValue,
      getFieldValue,
      personMode,
    } = this.props;
    if (currentTownHall.displayName !== prevProps.currentTownHall.displayName) {
      setFieldsValue({ 'preview-0': `${this.formatName()} ${this.formatDistrict()}` });
    }
    if (currentTownHall.members.length !== prevProps.currentTownHall.members.length) {
      currentTownHall.members.map((member) => {
        console.log(member);
      });
    }
    if (!getFieldValue('displayName') && personMode !== MANUAL_MODE && document.querySelector('.ant-select-selection__clear')) {
      // manually clear the autocomplete form since it won't reset
      document.querySelector('.ant-select-selection__clear').click();
    }
  }

  onNameSelect(value, index) {
    const {
      allPeople,
      peopleDataUrl,
      requestPersonDataById,
      requestAdditionalPersonDataById,
    } = this.props;

    const person = find(allPeople, {
      nameEntered: value,
    });
    if (index > 0) {
      return requestAdditionalPersonDataById(peopleDataUrl, person.id);
    }
    return requestPersonDataById(peopleDataUrl, person.id);
  }

  formatName() {
    const {
      currentTownHall,
      personMode,
    } = this.props;
    const prefixMapping = {
      HD: 'House District',
      SD: 'Senate District',
      GOV: 'Governor',
      statewide: 'Governor',
      LTGOV: 'Lt. Governor',
      upper: 'Sen.',
      lower: 'Rep.',
      nationwide: 'President',
    };
    if (currentTownHall.displayName && personMode === 'moc') {
      return `${prefixMapping[currentTownHall.chamber]} ${currentTownHall.displayName} (${currentTownHall.party})`;
    }
    if (currentTownHall.displayName && personMode === 'candidate') {
      return `${currentTownHall.displayName} (${currentTownHall.party}), Running for: `;
    }
    return '';
  }

  formatDistrict() {
    const {
      currentTownHall,
      selectedUSState,
    } = this.props;
    if (selectedUSState) {
      switch (currentTownHall.chamber) {
      case 'lower':
        return currentTownHall.district;
      case 'upper':
        return 'State Senate';
      case 'statewide':
        return currentTownHall.office || 'Statewide';
      case 'citywide':
        return currentTownHall.office || 'Citywide';
      default:
        return '';
      }
    }
    switch (currentTownHall.chamber) {
    case 'lower':
      return `${currentTownHall.state}-${currentTownHall.district}`;
    case 'upper':
      return 'Senate';
    case 'statewide':
      return currentTownHall.office || 'Statewide';
    case 'nationwide':
      return currentTownHall.office || 'President';
    case 'citywide':
      return currentTownHall.office || 'Citywide';
    default:
      return '';
    }
  }

  addMember() {
    const {
      getFieldValue,
      setFieldsValue,
    } = this.props;
    // can use data-binding to get
    const keys = getFieldValue('formKeys') || [0];
    const nextKeys = keys.concat(uuid);
    // eslint-disable-next-line no-plusplus
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    setFieldsValue({
      formKeys: nextKeys,
    });
  }

  removeAdditionalMember(k) {
    const {
      getFieldValue,
      setFieldsValue,
    } = this.props;
    // can use data-binding to get
    const keys = getFieldValue('formKeys') || [0];
    // We need at least one member
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    setFieldsValue({
      formKeys: keys.filter(key => key !== k),
    });
  }

  memberForms() {
    const {
      getFieldValue,
    } = this.props;
    const keys = getFieldValue('formKeys') || [0];
    const formItems = keys.map(k => this.renderDatabaseLookupForm(k, keys));
    return formItems;
  }

  renderDatabaseLookupForm(key, keys) {
    const {
      allNames,
      getFieldDecorator,
      selectedUSState,
      personMode,
    } = this.props;
    const intro = personMode === 'candidate' ? 'Candidate for ' : 'Member of ';
    let title = `${intro}Congress Information `;
    if (selectedUSState) {
      title = `${intro + selectedUSState} state legislature information`;
    }
    const fieldName = key > 0 ? `displayName-${key}` : 'displayName';
    const filterFunction = (inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
    return (
      <React.Fragment key={key}>
        <h4>
          {title}
          <br />
        </h4>
        <FormItem
          extra="Enter their name and we will auto-fill the information"
        >
          {
            getFieldDecorator(fieldName, {
              initialValue: '',
              rules: [{
                message: 'Please input a member of congress',
                required: true,
              }],
              validateTrigger: ['onChange', 'onBlur'],
              valuePropName: 'value',
            })(
              <div>
                <AutoComplete
                  style={{
                    width: '60%',
                    marginRight: 8,
                  }}
                  allowClear
                  key={key}
                  dataSource={allNames}
                  onSelect={value => this.onNameSelect(value, key)}
                  filterOption={filterFunction}
                  placeholder="Member of congress name"
                />

                {key > 0 ? (
                  <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    disabled={keys.length === 1}
                    onClick={() => this.removeAdditionalMember(key)}
                  />
                ) : null}
              </div>,
            )}

        </FormItem>
        <FormItem
          extra="How lawmaker or candidate name will be displayed"
        >
          {getFieldDecorator(`preview-${key}`, {
            initialValue: '',
          })(
            <Input
              type="text"
              className="input-underline"
              id="person-preview"
              placeholder="Lawmaker/candidate info"
              readOnly
            />,
          )
          }
        </FormItem>
      </React.Fragment>
    );
  }

  static renderAdopterForm() {
    return (
      <section className="adopter-data non-standard hidden">
        <div className="form-group col-sm-12" id="adopter-member-form-group">
          <label htmlFor="districtAdopter">
            MOC appearing at event (adopter)
          </label>
          <Input type="text" class="form-control input-underline" id="districtAdopter" placeholder="Full name" value="" autocomplete="off" />
          <span id="adopter-member-help-block" className="help-block">
          Only first name and last name, not titles
          </span>
        </div>
      </section>
    );
  }

  render() {
    const {
      personMode,
      togglePersonMode,
      currentTownHall,
      selectedUSState,
      getFieldValue,
      getFieldDecorator,
      setGenericTownHallValue,
    } = this.props;

    getFieldDecorator('formKeys', {
      initialValue: [0],
    });

    return (
      <section className="member-info">
        <Radio.Group
          defaultValue={personMode}
          buttonStyle="solid"
          onChange={event => togglePersonMode(event.target.value)}
        >
          <Radio.Button value={MOC_MODE}>
            In office (Moc or Gov)
          </Radio.Button>
          <Radio.Button value={CANDIDATE_MODE}>
            Candidate
          </Radio.Button>
          <Radio.Button value={MANUAL_MODE}>
            Manually Enter
          </Radio.Button>
        </Radio.Group>
        {personMode === 'manual' ? renderCustomPersonForm(
          {
            getFieldDecorator,
            currentTownHall,
            getFieldValue,
            selectedUSState,
            setGenericTownHallValue,
          },
        ) : this.memberForms()}

        <div className="district-group federal-district-group" id="federal-district-group">
          <FormItem>
            <Button type="dashed" onClick={this.addMember} style={{ width: '60%' }}>
              <Icon type="plus" /> Add another lawmaker
            </Button>
          </FormItem>
        </div>
      </section>
    );
  }
}

MemberLookup.propTypes = {
  allNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  allPeople: PropTypes.arrayOf(PropTypes.shape(
    {
      id: PropTypes.string,
      nameEntered: PropTypes.string,
    },
  )).isRequired,
  currentTownHall: PropTypes.shape({}).isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  peopleDataUrl: PropTypes.string.isRequired,
  personMode: PropTypes.string.isRequired,
  requestAdditionalPersonDataById: PropTypes.func.isRequired,
  requestPersonDataById: PropTypes.func.isRequired,
  selectedUSState: PropTypes.string,
  setFieldsValue: PropTypes.func.isRequired,
  togglePersonMode: PropTypes.func.isRequired,
};

MemberLookup.defaultProps = {
  selectedUSState: undefined,
};

export default MemberLookup;
