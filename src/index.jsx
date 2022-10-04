import "./wdyr";
import "antd/dist/antd.css";
import "balloon-css/balloon.min.css";
import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "redux-promise";
import { composeWithDevTools } from "@redux-devtools/extension";
import ErrorBoundary from "component/ErrorBoundary";
import log from "electron-log";
import { App } from "./container/App.jsx";
import reducer from "./reducer";
import mediator from "service/mediator";
import { RE_SNIPPETS_TEST_ADDED } from "constant";
import "service/perf";

window.onerror = ( err, url, lineNumber ) => {
  log.error( `Renderer process: Caught exception: ${err} in ${ url }: ${ lineNumber }` );
};

window.consoleCount = console.count.bind( console );
// window.consoleCount = () => {};

process.on( "uncaughtException", ( err ) => {
  console.error( "uncaughtException", err );
  log.error( `Renderer process: Caught exception: ${err}` );
});

// Store enhancement
const storeEnhancer = composeWithDevTools( 
        applyMiddleware(
          thunkMiddleware,
          promiseMiddleware
        ) 
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

const prevState = {};

store.subscribe( () => {
  const state = store.getState();
  if ( state.snippets.lastInsertTestId && prevState.snippetsLastInsertTestId !== state.snippets.lastInsertTestId ) {
    prevState.snippetsLastInsertTestId = state.snippets.lastInsertTestId;
    mediator.emit( RE_SNIPPETS_TEST_ADDED, { lastInsertTestId: state.snippets.lastInsertTestId });
  }

});