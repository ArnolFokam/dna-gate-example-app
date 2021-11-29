import './client/index.css';
import 'notyf/notyf.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './client/App';
import setupAxiosInterceptors from './client/config/axios-interceptor';
import getStore from './client/config/store';
import { bindActionCreators } from 'redux';
import { clearAuthentication } from './client/reducers/authentication.reducer';
import reportWebVitals from './client/reportWebVitals';

const store = getStore();

const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() => actions.clearAuthentication('login.error.unauthorized'));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
