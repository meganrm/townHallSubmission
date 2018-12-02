import React from 'react';
import PropTypes from 'prop-types';

import {
  Input,
  Select,
  Form,
} from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

const customMemberForm = (props) => {
  const {
    currentTownHall,
    selectedUSState,
  } = props;
  return (
    <React.Fragment>
      <FormItem>
        <label htmlFor="displayName" className="sr-only">
            Host's name
        </label>
        <Input
          type="text"
          className="input-underline"
          id="displayName"
          placeholder="Host name"
          value={currentTownHall.displayName || ''}
        />
      </FormItem>
      <FormItem>
        <label htmlFor="state" className="sr-only">
            State (abbrivation)
        </label>
        <Input
          type="text"
          className="input-underline"
          id="state"
          placeholder="State (abbrivation)"
          value={currentTownHall.state || ''}
        />
      </FormItem>
      <FormItem>
        <Input
          type="text"
          className="input-underline"
          id="stateName"
          placeholder="Home State"
          value={currentTownHall.stateName || ''}
        />
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
            ex HD-02
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
            <Input
              type="text"
              className="input-underline"
              id="district"
              placeholder="District"
              value=""
            />
            <span id="helpBlock" className="help-block">
            Zero padded number, ex '09', leave blank for senate
            </span>
          </FormItem>
        )}
      <FormItem>
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
        </Select>
      </FormItem>
      <FormItem className="chamber">
        <label className="" htmlFor="chamber">
            Chamber
        </label>
        <Select>
          <Option value="upper">
              Upper (Senate)
          </Option>
          <Option value="lower">
              Lower (House)
          </Option>
          <Option value="statewide">
              Statewide (executive)
          </Option>
        </Select>
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
