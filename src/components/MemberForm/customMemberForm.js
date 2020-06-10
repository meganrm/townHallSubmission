import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  Input,
  Select,
  Form,
  Button,
} from 'antd';

import states from '../../data/states';
import { formItemLayout, LEVEL_FEDERAL, LEVEL_STATE } from '../../constants';

const { Option } = Select;
const FormItem = Form.Item;


const stateChambers = [
  {
    value: 'upper',
    label: 'upper',
  },
  {
    value: 'lower',
    label: 'lower',
  },
  {
    value: 'statewide',
    label: 'Gov',
  },
  {
    value: 'citywide',
    label: 'Mayor or City Council',
  },
];

const federalChambers = [{
  value: 'upper',
  label: 'Senate',
},
{
  value: 'lower',
  label: 'House',
},
{
  value: 'nationwide',
  label: 'Pres',
},
];
const customMemberForm = (props) => {
  const {
    selectedUSState,
    getFieldValue,
    getFieldDecorator,
    setGenericTownHallValue,
    setDataFromManualEnter,
    setUsState,
    setDistrict,
  } = props;
  // setGenericTownHallValue({ key: 'level', value: selectedUSState ? LEVEL_STATE : LEVEL_FEDERAL });
  const onNameChange = (e) => {
    const { value } = e.target;
    setDataFromManualEnter({ displayName: value });
  };
  
  const onSelect = (key, value) => {
    setGenericTownHallValue({
      key,
      value,
    });
  };

  const onDistrictBlur = (e) => {
    const { value } = e.target;
    setDistrict(value);
  };


  const renderDistrict = () => (selectedUSState ? (
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
        onBlur={setDistrict}
        placeholder="District"
        {...formItemLayout}

      />
    </FormItem>)
    : (
      <FormItem
        className="district-group federal-district-group"
        id="federal-district-group"
        extra="Zero padded number, ex '09', leave blank"
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
              onBlur={onDistrictBlur}
            />,
          )}
      </FormItem>
    ));

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

      <FormItem label="Level (state or federal)" {...formItemLayout}>
        {getFieldDecorator('level', {
          initialValue: '',
          rules: [{ required: true }],
        })(
          <Select
            onSelect={value => onSelect('level', value)}

          >
            <Option key={LEVEL_FEDERAL} value={LEVEL_FEDERAL}>{LEVEL_FEDERAL}</Option>
            <Option key={LEVEL_STATE} value={LEVEL_STATE}>{LEVEL_STATE}</Option>
          </Select>,
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
              onSelect={value => onSelect('chamber', value)}

            >
              {getFieldValue('level') === LEVEL_FEDERAL
                ? map(federalChambers, item => <Option key={item.value} value={item.value}>{item.label}</Option>)
                : map(stateChambers, item => <Option key={item.value} value={item.value}>{item.label}</Option>)
              }
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
          initialValue: selectedUSState || '',
          rules: [{
            message: 'Please select a state',
            required: true,
          }],
        })(
          <Select
            placeholder="State (abbrivation)"
            style={{ width: '100%' }}
            onSelect={setUsState}

          >
            {map(states, (stateAb, key) => (<Option value={key} key={key}>{stateAb}</Option>))}
          </Select>
          ,
        )
        }

      </FormItem>
      <FormItem
      {...formItemLayout}
      label='City'
    >
      <Input
        type="text"
        className="input-underline"
        id="city"
        onBlur={(e) => setGenericTownHallValue({key: 'city', value: e.target.value})}
        placeholder="city"
        {...formItemLayout}

      />
    </FormItem>
      <FormItem
        label="Party"
        {...formItemLayout}
      >
        {getFieldDecorator('party', {
        })(
          <Select
            placeholder="Party"
            onSelect={value => onSelect('party', value)}
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
