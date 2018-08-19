import React from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'lodash';

import {
  AutoComplete,
  Input,
  Form,
  Radio,
  Select,
} from 'antd';
import {
  find,
} from 'lodash';

const {
  Option,
} = Select;
const FormItem = Form.Item;

class LocationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: undefined,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleChange(value) {
    this.setState({
      value: `You entered: ${value}`,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tempAddress) {
      this.setState(prevState => ({
        data: uniq([...prevState.data, `Formatted: ${nextProps.tempAddress}`]),
      }));
    }
  }

  handleSearch() {
    const {
      geoCodeLocation,
    } = this.props;
    const { value } = this.state;
    console.log(value.split(': '))
    geoCodeLocation(value.split(': ')[1]);
    this.setState(prevState => ({
      data: uniq([...prevState.data, prevState.value]),
    }));
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  handleSelect(value) {
    const { 
      saveAddress, 
      tempLat, 
      tempLng 
    } = this.props;
    const address = value.split(': ')[1]
    saveAddress({
      address,
      lng: tempLng, 
      lat: tempLat, 
    });
    this.setState({
      value: address,
    })
  }

  renderTeleInputs() {
    <FormItem className="form-group col-sm-12">
      <label className="" htmlFor="phoneNumber">
        Phone Number format: (555) 555-5555
      </label>
      <Input type="tel" class="form-control" id="phoneNumber" placeholder="Phone Number" value="" />
      <span id="phoneNumber-error" className="help-block error-message hidden">
        Please enter a valid phone number
      </span>
    </FormItem>;
  }

  render() {
    const options = this.state.data.map(d => (
      <Option key={d}>
          {d}
      </Option>
    ));
    return (
      <React.Fragment>
        <FormItem class="form-group col-sm-12 general-inputs">
          <Input type="text" className="form-control input-underline" id="Location" placeholder="Name of location (eg. Gary Recreation Center)" value="" />
        </FormItem>
        <FormItem className="form-group col-sm-12 general-inputs" id="location-form-group">
          <Select
            showSearch
            combobox
            onInputKeyDown={this.onKeyDown}
            value={this.state.value}
            placeholder="address"
            style={this.props.style}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={this.handleChange}
            onSelect={this.handleSelect}
            notFoundContent={null}
          >
            {options}
            <Option value= "disabled" disabled>
Hit enter to geocode address, then select address from dropdown
</Option>
          </Select>
          <span id="address-feedback" className="help-block">
Enter a valid street address, if there isn't one, leave this blank
          </span>
        </FormItem>
      </React.Fragment>
    );
  }
}

export default LocationForm;
