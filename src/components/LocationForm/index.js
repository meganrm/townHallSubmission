import React from 'react';
import PropTypes from 'prop-types';

import request from 'superagent';
import Places from 'google-places-web';
Places.apiKey = 'AIzaSyB868a1cMyPOQyzKoUrzbw894xeoUhx9MM';



import {
  AutoComplete,
  Input,
  Form,
  Radio,
  Select,
} from 'antd';
import {
  find
} from 'lodash';
const {
  Option
} = Select;
const FormItem = Form.Item;

class LocationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: undefined,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch (value) {
    const {
      geoCodeLocation,
    } = this.props;
    const radius = 2000;
    const language = 'en';
    // geoCodeLocation(value);
    // Search with default opts
    Places.autocomplete({
      input: value,
    })
      .then(places => places[0] || {})
      .then(place => place.place_id ? Places.details({
        placeid: place.place_id
      }) : {})
      .then(details => {
        console.log(JSON.stringify(details, null, 2));
      })
      .catch(e => console.log(e.message));
    // fetch(value, data => this.setState({
    //     data
    // }));
  }

  handleChange (value) {
    this.setState({
      value,
    });
  }


  renderTeleInputs(){
    <FormItem className="form-group col-sm-12">
      <label class="" for="phoneNumber">Phone Number format: (555) 555-5555</label>
      <Input type="tel" class="form-control" id="phoneNumber" placeholder="Phone Number" value="" />
      <span id="phoneNumber-error" class="help-block error-message hidden">Please enter a valid phone number</span>
    </FormItem>
  }

  render() {
    console.log(this.state.data)
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (
      <React.Fragment>
        <FormItem class="form-group col-sm-12 general-inputs">
          <Input type="text" className="form-control input-underline" id="Location" placeholder="Name of location (eg. Gary Recreation Center)" value="" />
        </FormItem>
        <FormItem className="form-group col-sm-12 general-inputs" id="location-form-group">
          <Select
            showSearch
            value={this.state.value}
            placeholder="address"
            style={this.props.style}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={this.handleSearch}
            onChange={this.handleChange}
            notFoundContent={null}
          >
            {options}
          </Select>
          <span id="address-feedback" className="help-block">Enter a valid street address, if there isn't one, leave this blank</span>
        </FormItem>
      </React.Fragment>
    )
  }
}

export default LocationForm;