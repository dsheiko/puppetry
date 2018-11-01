import "antd/dist/antd.css";
import "balloon-css/balloon.min.css";
import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import ErrorBoundary from "component/ErrorBoundary";

import { App } from "./container/App.jsx";
import { reducer } from "./reducer/reducers";

// Store enhancement
const storeEnhancer = composeWithDevTools( compose(
        applyMiddleware(
          thunkMiddleware,
          promiseMiddleware
        ) )
      ),

      // Store creation
      store = createStore(
        reducer,
        storeEnhancer
      );

render( <ErrorBoundary>
  <Provider store={store}>
    <App />
  </Provider>
</ErrorBoundary>, document.querySelector( "root" ) );


