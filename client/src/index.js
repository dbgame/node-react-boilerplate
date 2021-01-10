import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'antd/dist/antd.css';

import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';

// 원래는 createStore만 처리하는데, 추가로 promise와 thunk를 통해 객체 외에도 처리할 수 있도록 설정함
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)
ReactDOM.render(
  <Provider 
    store={createStoreWithMiddleware(Reducer, 
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
      <App />
  </Provider>

  , document.getElementById('root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
