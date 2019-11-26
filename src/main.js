
import React from 'react';
import { Provider } from 'react-redux';
import { Alert } from 'antd';

import App from './containers/App';

import store from './store/configureStore';

export const RedirectMessaging = (
  <Alert
    message="This is no longer a working url"
    description={[<div>Please use this link, and bookmark it:</div>, (<a href="https://townhallsubmission.herokuapp.com/">Submission Form</a>)]}
    type="success"
  />);

export const TownHallSubmissionForm = (<Provider store={store}>
    <App />
  </Provider>)

