import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  Input,
  Select,
  Form,
} from 'antd';

import states from '../../data/states';
import { formItemLayout } from '../../constants';

const { Option } = Select;
const FormItem = Form.Item;

const customMemberForm = (props) => {
  const {
    selectedUSState,
    getFieldValue,
    getFieldDecorator,
    setGenericTownHallValue,
  } = props;
  const onNameChange = (e) => {
    const { value } = e.target;
    setGenericTownHallValue({
      key: 'displayName',
      value,
    });
  };

  const renderDistrict = () => selectedUSState ? (
        <FormItem
          className="district-group"
          id="state-district-group"
          extra="ex HD-02 or SD-02"
          label="District"
          {...formItemLayout}
        >
          <Input
            type="text"
            className="input-underline"
            id="district"
            placeholder="District"
            {...formItemLayout}

          />
        </FormItem>)
        : (
          <FormItem
            className="district-group federal-district-group"
            id="federal-district-group"
            extra="Zero padded number, ex '09', leave blank for senated"
            label="District"
            {...formItemLayout}
          >
            {
              getFieldDecorator('district', {
                initialValue: '',
              })(
                <Input
                  type="text"
                  className="input-underline"
                  id="district"
                  placeholder="District"
                />,
              )}
          </FormItem>
        );

  return (
    <React.Fragment>
      <FormItem>
        {
          getFieldDecorator('displayName', {
            initialValue: '',
            rules: [{
              message: 'Please input a name',
              required: true,
            }],
          })(
            <Input
              type="text"
              className="input-underline"
              id="displayName"
              placeholder="Host name"
              onBlur={onNameChange}
            />,
          )}
      </FormItem>
      <FormItem 
        className="chamber"
        label="Chamber"
        {...formItemLayout}
      >
        {
          getFieldDecorator('chamber', {
            initialValue: 'undefined',
          })(

            <Select
              placeholder="chamber"
            >
              <Option value="upper">
                Upper (Senate)
              </Option>
              <Option value="lower">
                Lower (House)
              </Option>
              <Option value="statewide">
                Statewide (executive)
              </Option>
            </Select>,
          )}
      </FormItem>
      {
        getFieldValue('chamber') === 'lower' ? renderDistrict() : null}
      <FormItem
        label="State"
        {...formItemLayout}
      >
        {getFieldDecorator('state', {
          initialValue: '',
          rules: [{
            message: 'Please select a state',
            required: true,
          }],
        })(
          <Select
            placeholder="State (abbrivation)"
            style={{ width: '100%' }}
          >
            {map(states, (stateAb, key) => (<Option value={key} key={key}>{stateAb}</Option>))}
          </Select>
          ,
        )
        }

      </FormItem>

      <FormItem
        label="Party"
        {...formItemLayout}
      >
        {getFieldDecorator('party', {
        })(
          <Select
            placeholder="Party"
          >
            <Option value="Democratic">
              Democratic
            </Option>
            <Option value="Republican">
              Republican
            </Option>
            <Option value="Independent">
              Independent
            </Option>
          </Select>,
        )}
      </FormItem>
    </React.Fragment>

  );
};

customMemberForm.propTypes = {
  currentTownHall: PropTypes.shape({}).isRequired,
  selectedUSState: PropTypes.string,
};

customMemberForm.defaultProps = {
  selectedUSState: null,
};

export default customMemberForm;
