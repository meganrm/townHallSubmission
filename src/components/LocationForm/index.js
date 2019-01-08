import React from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'lodash';

import {
  Input,
  Form,
  Select,
} from 'antd';
import { formItemLayout } from '../../constants';

const {
  Option,
} = Select;
const FormItem = Form.Item;

class LocationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      validating: '',
      value: undefined,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tempAddress) {
      this.setState(prevState => ({
        data: uniq([...prevState.data, `Formatted: ${nextProps.tempAddress}`]),
        validating: 'success',
      }));
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  handleSearch() {
    const {
      geoCodeLocation,
    } = this.props;
    const {
      value,
    } = this.state;
    geoCodeLocation(value.split(': ')[1]);
    this.setState(prevState => ({
      data: uniq([...prevState.data, prevState.value]),
      validating: 'validating',
    }));
  }

  handleChange(value) {
    this.setState({
      value: `You entered: ${value}`,
    });
  }

  handleSelect(value) {
    const {
      saveAddress,
      tempLat,
      tempLng,
      tempStateInfo,
    } = this.props;
    const address = value.split(': ')[1];
    saveAddress({
      ...tempStateInfo,
      address,
      lat: tempLat,
      lng: tempLng,
    });
    this.setState({
      value: address,
    });
  }

  static renderTeleInputs() {
    return (
      <FormItem>
        <label className="" htmlFor="phoneNumber">
        Phone Number format: (555) 555-5555
        </label>
        <Input type="tel" class="form-control" id="phoneNumber" placeholder="Phone Number" value="" />
        <span id="phoneNumber-error" className="help-block error-message hidden">
        Please enter a valid phone number
        </span>
      </FormItem>);
  }

  render() {
    const {
      style,
      getFieldDecorator,
    } = this.props;
    const {
      validating,
      data,
    } = this.state;
    const options = data.map(d => (
      <Option key={d}>
        {d}
      </Option>
    ));
    return (
      <React.Fragment>
        <FormItem class="general-inputs">
          {getFieldDecorator('Location', {
            trigger: 'onBlur',
          })(
            <Input
              type="text"
              className="input-underline"
              id="Location"
              placeholder="Name of location (eg. Gary Recreation Center)"
            />,
          )}
        </FormItem>
        <FormItem
          className="general-inputs"
          id="location-form-group"
          hasFeedback
          validateStatus={validating}
          label="Address"
          {...formItemLayout}
        >
          {getFieldDecorator('address', {
            initialValue: '',
          })(
            <Select
              showSearch
              combobox
              onInputKeyDown={this.onKeyDown}
              placeholder="address"
              style={style}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleChange}
              onSelect={this.handleSelect}
              notFoundContent={null}
            >
              {options}
              <Option value="disabled" disabled>
            Hit enter to geocode address, then select address from dropdown
              </Option>
            </Select>,
          )
          }
        </FormItem>
      </React.Fragment>
    );
  }
}

LocationForm.propTypes = {
  geoCodeLocation: PropTypes.func.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  saveAddress: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
  tempAddress: PropTypes.string,
  tempLat: PropTypes.number,
  tempLng: PropTypes.number,
  tempStateInfo: PropTypes.shape({}),
};

LocationForm.defaultProps = {
  style: null,
  tempAddress: null,
  tempStateInfo: null,
  tempLat: 0,
  tempLng: 0,
};

export default LocationForm;
