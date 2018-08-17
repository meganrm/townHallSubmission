import React from 'react';
import PropTypes from 'prop-types';

import {
  AutoComplete,
  Input,
  Form,
  Radio,
  Select,
} from 'antd';
import { find } from 'lodash';
const { Option } = Select;
const FormItem = Form.Item;

class MemberLookup extends React.Component {
  constructor(props) {
    super(props);
    this.onNameSelect = this.onNameSelect.bind(this);
    this.formatDistrct = this.formatDistrct.bind(this);
  }

  onNameSelect(value) {
    const {
      allPeople,
      peopleDataUrl,
      requestPersonDataById,
    } = this.props;

    const person = find(allPeople, {
      nameEntered: value,
    });
    console.log(person);
    requestPersonDataById(peopleDataUrl, person.id);
  }

  formatDistrct() {
    const {
      currentTownHall,
      selectedUSState,
    } = this.props;
    if (selectedUSState) {
      return currentTownHall.district;
    }
    if (currentTownHall.chamber === 'lower') {
      return `${currentTownHall.state}-${currentTownHall.district}`;
    }
    if (currentTownHall.chamber === 'upper') {
      return 'Senate';
    }
    return '';
  }

  renderCustomPersonForm() {
    const { currentTownHall } = this.props;
    return (
      <div className="hidden advanced-moc-options" id="">
        <div className="form-group col-sm-6">
          <label for="state" className="sr-only">
            State (abbrivation)
          </label>
          <input type="text" className="form-control input-underline" id="state" placeholder="State (abbrivation)" value={currentTownHall.state || ""} />
        </div>
        <div className="form-group col-sm-6 col-md-6 district-group federal-district-group" id="federal-district-group">
          <label for="district" className="sr-only">
            District
          </label>
          <input type="text" className="form-control input-underline" id="district" placeholder="District" value="" />
          <span id="helpBlock" className="help-block">
            Zero padded number, ex '09', leave blank for senate
          </span>
        </div>
        <div className="form-group col-sm-6 col-md-6 district-group" id="state-district-group">
          <label  for="district" className="sr-only">
            District
          </label>
          <input type="text" className="form-control input-underline" id="district" placeholder="District" value="" />
          <span id="helpBlock" className="help-block">
            ex HD-02
          </span>
        </div>
        <div className="form-group chamber col-md-12 col-sm-12">
          <label className="" for="chamber">
            Chamber
          </label>
          <div className="input-group">
            <input type="text" className="form-control" aria-label="..." id="chamber" value="" placeholder="Chamber" readonly />
            <div className="input-group-btn">
              <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 
                <span className="caret"></span>
              </button>
              <Select className="dropdown-menu dropdown-menu-right">
                <li>
                  <a data-value="upper" href="#">Upper (Senate)</a>
                </li>
                <li>
                  <a data-value="lower" href="#">Lower (House)</a>
                </li>
                <li>
                  <a data-value="statewide" href="#">Statewide (executive)</a>
                </li>
              </Select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderAdopterForm(){
    return(       
    <section class="adopter-data non-standard hidden">
            <div class="form-group col-sm-12" id="adopter-member-form-group">
              <label for="districtAdopter">MOC appearing at event (adopter)</label>
              <Input type="text" class="form-control input-underline" id="districtAdopter" placeholder="Full name" value="" autocomplete="off" />
              <span id="adopter-member-help-block" class="help-block">Only first name and last name, not titles</span>
            </div>
          </section>
    )
  }

  render() {
    const {
      allNames,
      currentTownHall,
      togglePersonMode,
    } = this.props;
    return (
      <section className="member-info text-info">
        <h4 id="member-title">
          Member of Congress Information
          <br />
          <small>
            Enter their name and we will auto-fill the information
          </small>
        </h4>
        <Radio.Group
          defaultValue="moc"
          buttonStyle="solid"
          onChange={event => togglePersonMode(event.target.value)}
        >
          <Radio.Button value="moc">
            Sitting MoC
          </Radio.Button>
          <Radio.Button value="candidate">
            Candidate
          </Radio.Button>
        </Radio.Group>
        <AutoComplete
          dataSource={allNames}
          style={{ width: 200 }}
          onSelect={this.onNameSelect}
          filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          placeholder="Member of congress name"
        />

        <FormItem className="form-group col-md-12 col-sm-12">
          
            Home State
          <Input type="text" className="form-control input-underline" id="stateName" placeholder="Home State" value={currentTownHall.stateName} />
        </FormItem>
        <div className="form-group col-md-12 col-sm-12 district-group federal-district-group" id="federal-district-group">
          <label  for="District" className="sr-only">
            Federal District
          </label>
          <Input type="text" 
            className="form-control input-underline"
            id="displayDistrict"
            placeholder="District"
            value={this.formatDistrct()}
            readonly
          />
          <span id="helpBlock" className="help-block">
            How the district will be displayed
          </span>
        </div>
                    
        <FormItem className="form-group party col-sm-12">
          <Select
            value={currentTownHall.party || ''}
            placeholder="Party"
          >
            <Option value="Democratic">Democratic</Option>
            <Option value="Republican">Republican</Option>
            <Option value="Independent">Independent</Option>
          </Select>
        </FormItem>
      </section>
    );
  }
}

MemberLookup.propTypes = {
  allPeople: PropTypes.arrayOf(PropTypes.shape( 
    {
      id: PropTypes.number || PropTypes.string,
      nameEntered: PropTypes.string,
    },
  )).isRequired,
  allNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentTownHall: PropTypes.shape({}).isRequired,
  peopleDataUrl: PropTypes.string.isRequired,
  requestPersonDataById: PropTypes.func.isRequired,
};

export default MemberLookup;
