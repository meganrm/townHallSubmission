import React from 'react';
import PropTypes from 'prop-types';
import page from '../../vendor/scripts/page';

import {
  AutoComplete,
  Input,
  Form,
  Icon,
  Button,
  Modal,
} from 'antd';
import { find } from 'lodash';
import CustomMemberForm from './customMemberForm';

import './style.scss';
import {
  MOC_MODE,
  CANDIDATE_MODE,
  MANUAL_MODE,
  EVENT_TYPES,
  CAMPAIGN_ICON_FLAG
} from '../../constants';
import ButtonGroup from 'antd/lib/button/button-group';
import { getOfficeFromData } from '../../scripts/util';
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
    this.selectCampaign = this.selectCampaign.bind(this);
    this.selectOffice = this.selectOffice.bind(this);
    this.formatName = this.formatName.bind(this);
    this.shouldUpdatePersonDisplay = this.shouldUpdatePersonDisplay.bind(this);
    this.state = {
      modalVisible: false
    }
  }

  shouldUpdatePersonDisplay(prevProps) {
    const { currentTownHall } = this.props;
    return (currentTownHall.displayName && currentTownHall.displayName !== prevProps.currentTownHall.displayName) ||
    (currentTownHall.displayName && this.props.personMode !== prevProps.personMode)
  }

  componentDidUpdate(prevProps) {
    const {
      currentTownHall,
      setFieldsValue,
      getFieldValue,
      personMode,
      selectedOfficePerson
    } = this.props;


    if (selectedOfficePerson && !currentTownHall.eventId && !this.state.modalVisible) {
      this.setState({modalVisible: true})
    }

    if (currentTownHall.members.length !== prevProps.currentTownHall.members.length) {
      currentTownHall.members.forEach((member, index) => {
        const key = `preview-${index}`;
        setFieldsValue({
          [key]: `${this.formatName(member)} ${this.formatDistrict()}`,
        });
      });
    }

    if (this.shouldUpdatePersonDisplay(prevProps)) {
      const key = 'preview-0';
      setFieldsValue({
        [key]: `${this.formatName(currentTownHall)} ${this.formatDistrict()}`,
      });
    } else if (!currentTownHall.displayName && prevProps.currentTownHall.displayName) {
      const key = 'preview-0';
      setFieldsValue({
        [key]: '',
      });
    }
    if (!getFieldValue('displayName') && personMode !== MANUAL_MODE && document.querySelector('.ant-select-selection__clear')) {
      // manually clear the autocomplete form since it won't reset
      document.querySelector('.ant-select-selection__clear').click();
    }
  }

  resetInfoBasedOnSelectedPerson() {
    const {
      clearSelectedMember,
      setFieldsValue,
      clearMemberCandidateMode,
    } = this.props;
    clearSelectedMember();
    clearMemberCandidateMode();
    setFieldsValue({
      displayName: '',
      'preview-0': '',
      meetingType: '',
    });
  }

  onInputChange(value) {
    if (!value) {
      this.resetInfoBasedOnSelectedPerson();
    }
  }

  onNameSelect(value, index) {
    const {
      allPeople,
      currentTownHall,
      peopleDataUrl,
      requestPersonDataById,
      requestAdditionalPersonDataById,
      resetDatabaseLookUpError,
    } = this.props;
     if (!value) {
       this.resetInfoBasedOnSelectedPerson();
    }
    const person = find(allPeople, {
      displayName: value,
    });
    if (!person) {
      return;
    }
    resetDatabaseLookUpError();
    if (index === 0) {
      return requestPersonDataById(peopleDataUrl, person.id);
    }
    if (index + 1 <= currentTownHall.members.length) {
      return requestAdditionalPersonDataById(peopleDataUrl, person.id, index);
    }
    return requestAdditionalPersonDataById(peopleDataUrl, person.id);
  }

  selectCampaign() {
    const {
      setDataFromPersonInDatabaseAction,
      selectedOfficePerson,
      togglePersonMode,
      setFieldsValue,
      setIconFlag,
    } = this.props;

    togglePersonMode(CANDIDATE_MODE);
    setFieldsValue({meetingType: EVENT_TYPES.campaign_town_hall.name})
    setDataFromPersonInDatabaseAction({
      ...selectedOfficePerson,
      ...selectedOfficePerson.campaigns[0],
    })
    setIconFlag(CAMPAIGN_ICON_FLAG);
    this.setState({modalVisible: false})
  }

  selectOffice() {
    const {
      setDataFromPersonInDatabaseAction,
      selectedOfficePerson,
      togglePersonMode,
      setFieldsValue,
    } = this.props;

    togglePersonMode(MOC_MODE);
    // reset since we dont know what the default option should be here
    setFieldsValue({
      meetingType: ''
    })

    setDataFromPersonInDatabaseAction({
      ...selectedOfficePerson,
      ...selectedOfficePerson.roles[0],
    })
    this.setState({modalVisible: false})
  }

  formatName() {
    const {
      currentTownHall,
      personMode,
    } = this.props;
    const prefixMapping = {
      GOV: 'Governor',
      HD: 'House District',
      LTGOV: 'Lt. Governor',
      SD: 'Senate District',
      lower: 'Rep.',
      nationwide: 'President',
      statewide: 'Governor',
      upper: 'Sen.',
    };
    if (currentTownHall.displayName && personMode === MOC_MODE) {
      return `${prefixMapping[currentTownHall.chamber]} ${currentTownHall.displayName} (${currentTownHall.party})`;
    }
    if (currentTownHall.displayName && personMode === CANDIDATE_MODE) {
      return `${currentTownHall.displayName} (${currentTownHall.party}), Running for: `;
    } 
    if (currentTownHall.displayName) {
      return `${currentTownHall.displayName}`
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
        return currentTownHall.district;
      case 'statewide':
        return currentTownHall.office || 'State-wide';
      case 'citywide':
        return currentTownHall.office || 'City-wide';
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

  addCustomMember = () => {
    const {
      clearSelectedMember,
      togglePersonMode,
      resetAllData,
    } = this.props
    clearSelectedMember();
    resetAllData();
    togglePersonMode(MANUAL_MODE);
  }

  memberForms() {
    const {
      getFieldValue,
    } = this.props;
    const keys = getFieldValue('formKeys') || [0];
    const formItems = keys.map(k => this.renderDatabaseLookupForm(k, keys));
    return formItems;
  }

  renderOptions() {
    const { selectedOfficePerson } = this.props;
    if (selectedOfficePerson.roles && selectedOfficePerson.campaigns) {
      return (<Modal
        visible={this.state.modalVisible}
        footer={null}
      > 
         <ButtonGroup>
              {selectedOfficePerson.campaigns && <Button onClick={this.selectCampaign}>
                Candidate for: {getOfficeFromData(selectedOfficePerson.campaigns[0])}
              </Button>}
              {selectedOfficePerson.roles && <Button onClick={this.selectOffice}>
                Current office: {getOfficeFromData(selectedOfficePerson.roles[0])}
              </Button>}
          </ButtonGroup>
      </Modal>)
    }
  }

  renderDatabaseLookupForm(key, keys) {
    const {
      allNames,
      getFieldDecorator,
      getError,
      selectedOfficePerson,
      peopleLookUpError,
    } = this.props;
    const title = 'Lawmaker Information';
    const placeHolderText = 'Lawmaker/candidate Name';
    const fieldName = key > 0 ? `displayName-${key}` : 'displayName';
    const filterFunction = (inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
    return (
      <React.Fragment key={key}>
        <h4>
          {title}
          <br />
        </h4>
        <FormItem
          extra="Enter their name and we will auto-fill their information"
          validateStatus={(getError('displayName') || peopleLookUpError) ? 'error' : ''}
          help={getError('displayName') || peopleLookUpError || ''}
        >
          {
            getFieldDecorator(fieldName, {
              initialValue: '',
              rules: [{
                message: 'Please input a lawmaker',
                required: true,
              }],
              validateTrigger: ['onChange'],
              valuePropName: 'value',
            })(
              <div>
                <AutoComplete
                  style={{
                    marginRight: 8,
                    width: '60%',
                  }}
                  allowClear
                  key={key}
                  dataSource={allNames}
                  onSelect={value => this.onNameSelect(value, key)}
                  onChange={value => this.onInputChange(value)}
                  onBlur={value => this.onNameSelect(value, key)}
                  filterOption={filterFunction}
                  placeholder={placeHolderText}
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
        <h5>
          If you are unable to find the lawmaker or candidate you are looking for, you may request to add a new individual to the system.
        </h5>
        <FormItem
          extra="Please first check if the individual already exists in our system"
        >
          <Button type="dashed" onClick={() => this.addCustomMember()} style={{ width: '60%' }}>
            <Icon type="plus" /> Add new lawmaker
          </Button>
        </FormItem>
        <FormItem>
          {this.renderOptions()}
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
      clearSelectedMember,
      currentTownHall,
      getFieldValue,
      getFieldDecorator,
      personMode,
      resetAllData,
      selectedUSState,
      setGenericTownHallValue,
    } = this.props;

    getFieldDecorator('formKeys', {
      initialValue: [0],
    });

    const setPersonMode = (mode) => {
      const currentLocation = window.location.pathname;
      const newPathName = `/${mode}`
      if (currentLocation === newPathName) {
        return;
      }
      if (mode === 'candidate') {
        if (currentLocation !== '/' && !currentLocation.includes('candidate')) {
          page(currentLocation + newPathName)
        } else if (currentLocation === '/') {
          page(newPathName)
        }
      } else {
        if (currentLocation.includes('candidate')) {
          console.log('include candidate')
          let newLocation = currentLocation.split('/candidate')[0]
          page(newLocation || '/')
        }
      }
    }

    return (
      <section className="member-info">
        {/* <div className="district-group federal-district-group" id="federal-district-group">
           <FormItem>
             <Button type="dashed" onClick={this.addMember} style={{ width: '60%' }}>
               <Icon type="plus" /> Add another lawmaker
             </Button>
           </FormItem>
         </div> */}

        {personMode === 'manual'
        ? <CustomMemberForm
          clearSelectedMember={clearSelectedMember}
          currentTownHall={currentTownHall}
          getFieldDecorator={getFieldDecorator}
          getFieldValue={getFieldValue}
          resetAllData={resetAllData}
          selectedUSState={selectedUSState}
          setGenericTownHallValue={setGenericTownHallValue}
        />
        : this.memberForms()}
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
  getError: PropTypes.func.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  handleDatabaseLookupError: PropTypes.func.isRequired,
  peopleDataUrl: PropTypes.string.isRequired,
  peopleLookUpError: PropTypes.string,
  personMode: PropTypes.string.isRequired,
  requestAdditionalPersonDataById: PropTypes.func.isRequired,
  requestPersonDataById: PropTypes.func.isRequired,
  resetDatabaseLookUpError: PropTypes.func.isRequired,
  selectedUSState: PropTypes.string,
  setFieldsValue: PropTypes.func.isRequired,
  setGenericTownHallValue: PropTypes.func.isRequired,
  togglePersonMode: PropTypes.func.isRequired,
};

MemberLookup.defaultProps = {
  peopleLookUpError: null,
  selectedUSState: undefined,
};

export default MemberLookup;
