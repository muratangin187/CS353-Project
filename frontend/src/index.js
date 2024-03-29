import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import axios from "axios";

axios.defaults.validateStatus = function () {
    return true;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);