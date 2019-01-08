import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  Input,
  Select,
  Form,
} from 'antd';

import states from '../../data/states';

const { Option } = Select;
const FormItem = Form.Item;


const customMemberForm = (props) => {
  const {
    currentTownHall,
    selectedUSState,
    getFieldDecorator,
    setGenericTownHallValue,
  } = props;
  getFieldDecorator('displayName', {
    initialValue: '',
  });
  const onNameChange = (e) => {
    const { value } = e.target;
    setGenericTownHallValue({
      key: 'displayName',
      value,
    });
  };
  return (
    <React.Fragment>
      <FormItem>
        <label htmlFor="displayName" className="sr-only">
            Host's name
        </label>
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
      <FormItem>
        <label htmlFor="state" className="sr-only">
            State (abbrivation)
        </label>
        {getFieldDecorator('state', {
          initialValue: '',
          rules: [{
            message: 'Please select a state',
            required: true,
          }],
          valuePropName: 'option',
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
      {selectedUSState ? (
        <FormItem
          className="district-group"
          id="state-district-group"
        >
          <label htmlFor="district" className="sr-only">
            District
          </label>
          <Input
            type="text"
            className="input-underline"
            id="district"
            placeholder="District"
          />
          <span id="helpBlock" className="help-block">
            ex HD-02 or SD-02
          </span>
        </FormItem>)
        : (
          <FormItem
            className="district-group federal-district-group"
            id="federal-district-group"
          >
            <label htmlFor="district" className="sr-only">
            District
            </label>
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
            <span id="helpBlock" className="help-block">
            Zero padded number, ex '09', leave blank for senate
            </span>
          </FormItem>
        )}
      <FormItem>
        {getFieldDecorator('party', {
          initialValue: '',
          valuePropName: 'option',
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
      <FormItem className="chamber">
        <label className="" htmlFor="chamber">
            Chamber
        </label>
        {
          getFieldDecorator('chamber', {
            initialValue: 'undefined',
            valuePropName: 'option',
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
