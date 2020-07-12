import { Form, Input, Icon, Button } from 'antd';
import React from 'react';

let id = 0;

class AdditionalLinks extends React.Component {
    remove = k => {
        const { form } = this.props;
        // can use data-binding to get
        const links = form.getFieldValue('links');
        // We need at least one passenger
        if (links.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            links: links.filter(key => key !== k),
        });
    };

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const links = form.getFieldValue('links');
        const nextLinks = links.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            links: nextLinks,
        });
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        getFieldDecorator('links', { initialValue: [] });
        const links = getFieldValue('links');
        const formItems = links.map((k, index) => (
            <React.Fragment>
                <Form.Item
                    {...formItemLayout}
                    label={index === 0 ? 'Additional links (rsvp, sign up for comments, live stream etc)' : ''}
                    required={false}
                    key={`linkUrls[${k}]`}
                >

                    {getFieldDecorator(`linkUrls[${k}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "Please input a url.",
                            },
                        ],}
                                
                    )(<Input key={`linkUrls[${k}]`} placeholder="url" style={{ width: '90%', marginRight: 8 }} className="input-underline" />)}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    required={false}
                    key={`linkNames[${k}]`}
                >
                    {getFieldDecorator(`linkNames[${k}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "Please enter a display name for the link, ie RSVP.",
                            },
                        ],
                    })(<Input key={`linkNames[${k}]`} placeholder="link name" style={{ width: '90%', marginRight: 8 }} className="input-underline" />)}
                        <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                        />
                </Form.Item>
            </React.Fragment>
        ))

        return (
            <React.Fragment>
                {formItems}
                <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                        <Icon type="plus" /> Add another link
                    </Button>
                </Form.Item>
            </React.Fragment>
        );
    }
}

export default AdditionalLinks;