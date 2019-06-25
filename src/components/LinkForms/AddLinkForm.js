import React from 'react';
import PropTypes from 'prop-types';

import {
  Modal,
  Form,
  Input,
} from 'antd';

const AddLinkForm = Form.create({ name: 'link_add_form' })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Add a new Link"
          okText="Add"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Title">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please input the title of the link.' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="URL">
              {getFieldDecorator('url', {
                rules: [{ required: true, message: 'Please input the webpage url' }],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

export default AddLinkForm;