import React from 'react';
import { Button, Layout, notification } from 'antd';
import thpLogo from "../../assets/images/THP_logo_horizontal_simple.png";
const {
  Header,
} = Layout;

import './style.scss';

const openNotification = () => {
  notification.open({
    message: 'Having trouble?',
    description:
      `Email: info@townhallproject.com`,
  });
};

function PageHeader() {
  return (
    <Header className="header" style={{ background: '#fff', padding: 0 }}>
      <img className="thp-logo" src={thpLogo} />
      <Button onClick={openNotification} className="info-btn" type="primary" shape="circle" icon="question-circle" theme="twoTone" />
    </Header>
  );
}

export default PageHeader;