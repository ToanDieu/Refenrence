import { createStore, compose, applyMiddleware } from "redux";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from "redux-thunk";
import { routerMiddleware } from "connected-react-router";

import history from "@/utils/history";
import createReducer from "../reducers";
import { trackPageNavigate } from "./middleware";

function configureStoreProd(initialState) {
  const reactRouterMiddleware = routerMiddleware(history);
  const middlewares = [thunk, reactRouterMiddleware, trackPageNavigate];

  const store = createStore(
    createReducer(),
    initialState,
    compose(applyMiddleware(...middlewares))
  );

  // Extensions
  store.injectedReducers = {}; // Reducer registry

  return store;
}

function configureStoreDev(initialState) {
  const reactRouterMiddleware = routerMiddleware(history);
  const middlewares = [
    reduxImmutableStateInvariant(),
    thunk,
    reactRouterMiddleware,
    trackPageNavigate
  ];

  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
  const store = createStore(
    createReducer(),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  // Extensions
  store.injectedReducers = {}; // Reducer registry

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("../reducers", () => {
      const nextReducer = require("../reducers").default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

const store =
  process.env.NODE_ENV === "production"
    ? configureStoreProd()
    : configureStoreDev();

export { history, store };
