import React from 'react';
import PropTypes from 'prop-types';

import {
  Alert,
  Input,
  Form,
} from 'antd';

import { formItemLayout } from '../../constants';


const FormItem = Form.Item;

const initialState = {
  data: [],
  validating: '',
  value: undefined,
};

class LocationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validating: '',
      value: undefined,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.clearAddressTimeout = this.clearAddressTimeout.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { tempAddress } = this.props;
    if (!prevProps.tempAddress && tempAddress) {
      this.confirmingTime = setTimeout(this.handleSelect, 300);
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  }

  clearAddressTimeout() {
    clearTimeout(this.confirmingTime);
    this.setState(initialState);
  }


  handleSearch() {
    const {
      geoCodeLocation,
    } = this.props;
    const {
      value,
    } = this.state;
    geoCodeLocation(value);
    this.setState({
      validating: 'validating',
    });
  }

  handleChange({ target }) {
    this.setState({
      value: target.value,
    });
  }

  handleSelect() {
    const {
      saveAddress,
      clearTempAddress,
      tempLat,
      tempLng,
      tempStateInfo,
      tempAddress,
      setFieldsValue,
    } = this.props;
    saveAddress({
      ...tempStateInfo,
      address: tempAddress,
      lat: tempLat,
      lng: tempLng,
    });
    this.setState(initialState);
    clearTempAddress();
    setFieldsValue({ address: tempAddress });
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
      address,
      style,
      getFieldDecorator,
      tempAddress,
    } = this.props;
    const {
      validating,
    } = this.state;

    return (
      <React.Fragment>
        <FormItem class="general-inputs">
          {getFieldDecorator('Location', {
            initialValue: '',
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
          validateStatus={validating && !tempAddress}
          label="Address"
          {...formItemLayout}
        >
          {getFieldDecorator('address', {
            initialValue: '',
            isRequired: true,
            message: 'please enter an address',
          })(

            <Input
              onInputKeyDown={this.onKeyDown}
              placeholder="address"
              style={style}
              onChange={this.handleChange}
              onBlur={this.handleSearch}
              notFoundContent={null}
            />,
          )
          }

        </FormItem>
        {
          (tempAddress || address) && (
            <Alert
              message={(<p>Address from geocoding: <br /><strong>{tempAddress || address}</strong></p>)}
              type="success"
              showIcon
              onClose={this.clearAddressTimeout}
            />
          )}
      </React.Fragment>
    );
  }
}

LocationForm.propTypes = {
  address: PropTypes.string,
  clearTempAddress: PropTypes.func.isRequired,
  geoCodeLocation: PropTypes.func.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  saveAddress: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
  tempAddress: PropTypes.string,
  tempLat: PropTypes.number,
  tempLng: PropTypes.number,
  tempStateInfo: PropTypes.shape({}),
};

LocationForm.defaultProps = {
  address: '',
  style: null,
  tempAddress: null,
  tempLat: 0,
  tempLng: 0,
  tempStateInfo: null,
};

export default LocationForm;
