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
    this.handleSelect = this.handleSelect.bind(this);
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
          validateStatus={validating}
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
        {tempAddress && (
          <Alert
            message={(<p>Confirm address from geocoding: <br /><strong>{tempAddress}</strong></p>)}
            type="success"
            closable
            showIcon
            closeText="OK"
            onClose={this.handleSelect}
          />
        )}
      </React.Fragment>
    );
  }
}

LocationForm.propTypes = {
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
  style: null,
  tempAddress: null,
  tempStateInfo: null,
  tempLat: 0,
  tempLng: 0,
};

export default LocationForm;
