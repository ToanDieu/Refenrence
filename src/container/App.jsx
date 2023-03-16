/* eslint-disable import/no-named-as-default */
/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import { pathOr } from "ramda";

import PopupHelper from "@/helpers/PopupHelper";
import BaseContent from "@/container/BaseContent";
import CaseDetail from "../components/case-detail";
// import TypeList from "../container/TypeList";
import LoginPage from "./LoginPage";
import Cases from "./Cases";
import Sidebar from "./Sidebar";
import Notification from "./Notification";
import {
  AnalyticPageComponent,
  AnalyticPassScanRatioPageComponent
} from "./AnalyticPage";
import NotFoundPage from "../components/NotFoundPage";
import FeedBack from "../components/feedback";
import SearchCases from "./SearchCases";
import Header from "./Header";
import ProtectedRoute from "../components/ProtectedRoute";
import PassReview from "./PassReview";
import Users from "./Users";
import WorkflowDetail from "./WorkflowDetail";
import BaseListPage from "./BaseListPage";
import GeneralAnalytic from "../components/analytic/general-analytic/container";
import Footer from "@/components/footer/container";
import EnvironmentLabel from "@/components/presents/EnvironmentLabel";
import config from "@/appConfig";

import { addNewEvent, showNotifications } from "../actions/notify";
import { getRoutePath, getDefaultSetting } from "../actions/utils";

const ProtectedComponent = ({ component: Component, ...props }) =>
  localStorage.getItem("token") ? <Component {...props} /> : null;

ProtectedComponent.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired
};

const App = ({ user, baseList, typeOrg }) => {
  const [typeID, setTypeID] = useState(
    typeOrg.data[0].id ? parseInt(typeOrg.data[0].id, 10) : typeOrg.data[0].id
  );

  useEffect(
    () =>
      setTypeID(
        typeOrg.data[0].id
          ? parseInt(typeOrg.data[0].id, 10)
          : typeOrg.data[0].id
      ),
    [typeOrg]
  );

  const getPath = pageType => {
    const orgName = user && user.orgName ? user.orgName : undefined;

    let defaultPath;
    switch (pageType) {
      case "homePage":
        defaultPath = "/";
        break;
      default:
        break;
    }

    // if (isContainScope("list:my-org-type:base")) {
    //   return defaultPath;
    // }
    if (!orgName) {
      return defaultPath;
    }

    const pathURL = getRoutePath(pageType, orgName);

    const regex = /\/\$([A-Z_]+)\//gm;
    const match = regex.exec(pathURL);
    if (!match) {
      return defaultPath;
    }

    const matchedValue = match[1];
    switch (matchedValue) {
      case "DEFAULT_BASE_ID":
        if (baseList.length > 0) {
          let defaultBaseID = getDefaultSetting("baseId", orgName);
          if (!defaultBaseID) {
            defaultBaseID = baseList[0].id;
          }

          return pathURL.replace("$DEFAULT_BASE_ID", defaultBaseID);
        }

        break;
      default:
        break;
    }

    return defaultPath;
  };

  const changePasstype = typeId => {
    setTypeID(typeId);
  };

  const redirectComp = () => (
    <Route
      render={() => (
        <Redirect
          to={{ pathname: getPath("homePage"), state: { from: "/" } }}
        />
      )}
    />
  );
  let heightReduced = 0;
  const token = localStorage.getItem("token");
  const env = config.TSE_ENV_LABEL;
  // header: 70px env: 18px
  // token existed and on dev/staging
  if (token && env) {
    heightReduced = 88;
    // token existed and on production
  } else if (token && !env) {
    heightReduced = 70;
    // token none-existed and on dev/staging
  } else if (!token && env) {
    heightReduced = 18;
    // token none-existed and on production
  } else if (!token && !env) {
    heightReduced = 0;
  }

  return (
    <div className="app">
      <EnvironmentLabel
        env={config.TSE_ENV_LABEL ? config.TSE_ENV_LABEL : ""}
      />
      {typeID && (
        <ProtectedComponent
          typeID={typeID}
          changePasstype={changePasstype}
          component={Header}
        />
      )}
      <PopupHelper
        use={({ children, onClose }) => <div>{children(onClose)}</div>}
      >
        <div className={`main main--header-${heightReduced}`}>
          <ProtectedComponent component={Sidebar} />
          <div className="main__content">
            <Switch>
              {typeID && (
                <ProtectedRoute
                  exact
                  path="/"
                  typeID={typeID}
                  component={
                    getPath("homePage") !== "/" ? redirectComp : BaseListPage
                  }
                />
              )}
              <ProtectedRoute
                scope="list:my-org-type-base:notification"
                exact
                path="/notifications"
                component={Notification}
              />
              <ProtectedRoute
                scope="list:my-org-type-base:case"
                exact
                path="/bases/:baseID/cases"
                component={Cases}
              />
              <ProtectedRoute
                scope="list:my-org:user"
                exact
                path="/users"
                component={Users}
              />
              {typeID && (
                <ProtectedRoute
                  scope="list:my-org-type:base"
                  exact
                  path="/bases"
                  typeID={typeID}
                  component={BaseListPage}
                />
              )}
              <ProtectedRoute
                scope="get:my-org-type:base"
                exact
                path="/bases/:baseID/workflows/:id/actions"
                component={WorkflowDetail}
              />
              <ProtectedRoute
                scope="get:my-org-type:base"
                path="/bases/:baseID"
                component={BaseContent}
              />
              <ProtectedRoute
                scope="get:my-org-type-base:case"
                exact
                path="/case/:id"
                component={CaseDetail}
              />
              {typeID && (
                <ProtectedRoute
                  scope="list:my-org-type:base"
                  exact
                  path="/search/bases/:searchTerm?"
                  typeID={typeID}
                  component={BaseListPage}
                />
              )}
              <ProtectedRoute
                scope="list:my-org-type-base:case"
                exact
                path="/search/:searchTerm"
                component={SearchCases}
              />
              <ProtectedRoute
                scopes={[
                  "get:my-org-type-base:analytic",
                  "get:my-org-type-base:analytic-case"
                ]}
                exact
                path="/analytic"
                component={AnalyticPageComponent}
              />
              <ProtectedRoute
                scope="get:my-org-type-base:analyticbyfield"
                exact
                path="/analytic/byfield"
                component={AnalyticPassScanRatioPageComponent}
              />
              <ProtectedRoute
                scope="get:my-org-type:base"
                exact
                path="/previewpass/:id"
                component={PassReview}
              />
              <ProtectedRoute
                scope="get:my-org-type-base:qualitative-feedback"
                exact
                path="/feedback"
                component={FeedBack}
              />
              <ProtectedRoute
                scope="get:my-org-type-base:analytic"
                exact
                path="/activities-report/"
                component={GeneralAnalytic}
              />
              <Route exact path="/login" component={LoginPage} />
              <ProtectedRoute component={NotFoundPage} />
            </Switch>
            <Footer />
          </div>
        </div>
      </PopupHelper>
    </div>
  );
};

App.propTypes = {
  typeOrg: PropTypes.object.isRequired,
  baseList: PropTypes.object.isRequired
};

export default withRouter(
  connect(
    state => ({
      user: state.user.data,
      baseList: state.baseList.data ? state.baseList.data : [],
      typeOrg: state.typeOrg.data
        ? state.typeOrg
        : { data: [{ id: undefined }] }
    }),
    dispatch => ({
      showNotifications: bindActionCreators(showNotifications, dispatch),
      addNewEvent: bindActionCreators(addNewEvent, dispatch)
    })
  )(App)
);
