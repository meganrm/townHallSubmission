import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Input,
  Form,
} from 'antd';
import { includes } from 'lodash';

import { formItemLayout } from '../../constants';

const { Search } = Input;
const FormItem = Form.Item;

const initialState = {
  showResponse: false,
  validating: '',
  value: undefined,
};

class LocationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
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
    e.preventDefault()
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
      address,
    } = this.props;
    const {
      value,
    } = this.state;
    if (address === value || !value) {
      return;
    }
    geoCodeLocation(value);
    this.setState({
      showResponse: true,
      validating: 'validating',
    });
  }

  handleChange({ target }) {
    if (!target) {
      this.setState(initialState);
    }
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
    this.setState({
      validating: false,
    });
    clearTempAddress();
    setFieldsValue({ address: tempAddress });
  }

  renderTeleInputs() {
    const {
      getFieldDecorator,
      requiredFields,
      tempAddress,
      style,
    } = this.props;
    const {
      validating,
    } = this.state;
    return (
      <React.Fragment>
            <FormItem>
              {getFieldDecorator('phoneNumber', {
                initialValue: '',
              })(<Input type="tel" class="form-control" placeholder="Phone Number" />)}
            </FormItem>

            <FormItem
              className="general-inputs"
              id="location-form-group"
              hasFeedback
              // help={getError('address') || ''}
              validateStatus={validating && !tempAddress ? 'validating' : ''}
              label="Zipcode"
              {...formItemLayout}
            >
              {getFieldDecorator('address', {
                initialValue: '',
                rules: [{
                  message: 'please enter a zipcode',
                  required: includes(requiredFields, 'address'),
                }],
              })(
                <Search
                  onPressEnter={this.onKeyDown}
                  onSearch={this.handleSearch}
                  placeholder="zipcode for geocoding"
                  style={style}
                  onChange={this.handleChange}
                  onBlur={this.handleSearch}
                />,
              )}
            </FormItem>
          </React.Fragment>
      );
  }

  render() {
    const {
      address,
      style,
      getFieldDecorator,
      tempAddress,
      getFieldValue,
      requiredFields,

    } = this.props;
    const {
      showResponse,
      validating,
    } = this.state;
    const meetingType = getFieldValue('meetingType');
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
        {meetingType === 'Tele-Town Hall' ? this.renderTeleInputs()
          : (
            <FormItem
              className="general-inputs"
              id="location-form-group"
              hasFeedback
              // help={getError('address') || ''}
              validateStatus={validating && !tempAddress ? 'validating' : ''}
              label="Full Street Address"
              {...formItemLayout}
            >
              {getFieldDecorator('address', {
                initialValue: '',
                rules: [{
                  message: 'please enter an address',
                  required: includes(requiredFields, 'address'),
                }],
              })(
                <Search
                  onPressEnter={this.onKeyDown}
                  onSearch={this.handleSearch}
                  placeholder="address"
                  style={style}
                  onChange={this.handleChange}
                  onBlur={this.handleSearch}
                />,
              )}
            </FormItem>
          )}
        {
          (tempAddress || address) && showResponse && (
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
  getFieldValue: PropTypes.func.isRequired,
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
