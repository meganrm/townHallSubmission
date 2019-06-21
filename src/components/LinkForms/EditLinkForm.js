import React from 'react';
import PropTypes from 'prop-types';

import {
  Modal,
  Form,
  Input,
  Popconfirm,
  message
} from 'antd';

const EditLinkForm = Form.create({ name: 'link_edit_form' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, link, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const confirm = (e) => {
        this.props.onDelete();
        this.props.onCancel();
        message.success('Link Deleted');
      }
      return (
        <Modal
          visible={visible}
          title="Edit Link"
          okText="Update"
          cancelText={
            <Popconfirm
              title="Are you sure delete this link?"
              onConfirm={confirm}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">Delete</a>
            </Popconfirm>
          }
          cancelButtonProps={{
            type: 'danger',
            onClick: () => { return; }
          }}
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Title">
              {getFieldDecorator('title', {
                initialValue: link.link_title,
                rules: [{ required: true, message: 'Please input the title of the link.' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="URL">
              {getFieldDecorator('url', {
                initialValue: link.url,
                rules: [{ required: true, message: 'Please input the webpage url' }],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);

export default EditLinkForm;