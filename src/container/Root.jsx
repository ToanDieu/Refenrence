/* eslint-disable react/forbid-prop-types */
import { hot } from "react-hot-loader/root";
import PropTypes from "prop-types";
import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import { ThemeProvider } from "emotion-theming";
import { PersistGate } from "redux-persist/integration/react";
import { HTTPClient } from "tse-ui-lib";
import { apiCaller } from "@/ducks/init";
import theme from "../components/theme";

import App from "./App";

const Root = ({ store, history, persistor }) => (
  <PersistGate loading={null} persistor={persistor}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <HTTPClient.Provider value={apiCaller}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </HTTPClient.Provider>
      </ConnectedRouter>
    </Provider>
  </PersistGate>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  persistor: PropTypes.object.isRequired
};

export default hot(Root);
