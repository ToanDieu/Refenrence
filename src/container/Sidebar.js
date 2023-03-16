// Cores
import React, { Component, Fragment } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Actions

// Assets
import notificationIcon from "../assets/icons/ic-notification.svg";
import notificationActiveIcon from "../assets/icons/ic-notification-active.svg";
import casesIcon from "../assets/icons/ic-file.svg";
import basesIcon from "../assets/icons/ic-folder.svg";
import chartIcon from "../assets/icons/ic-chart.svg";
import userIcon from "../assets/icons/ic-user.svg";
import feedbackIcon from "../assets/icons/ic-list-star.svg";
import activitiesReportIcon from "@/assets/icons/ic-control.svg";

import { ProtectedScopedComponent } from "../components/HocComponent";

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render = () => (
    <Fragment>
      <div className="main__sidebar">
        <ProtectedScopedComponent
          scopes={["list:my-org-type-base:notification"]}
        >
          <div className="sidebar__item">
            <div
              className={`sidebar__item-icon${
                this.props.haveCurrentBase
                  ? ""
                  : " sidebar__item-icon--disabled"
              }`}
            >
              <Link to={this.props.haveCurrentBase ? "/notifications" : "/"}>
                <img
                  className="icon-img-24"
                  src={
                    this.props.notification.isChanged
                      ? notificationActiveIcon
                      : notificationIcon
                  }
                />
              </Link>
            </div>
          </div>
        </ProtectedScopedComponent>

        <ProtectedScopedComponent scopes={["list:my-org-type-base:case"]}>
          <div className="sidebar__item">
            <div
              className={`sidebar__item-icon${
                this.props.haveCurrentBase
                  ? ""
                  : " sidebar__item-icon--disabled"
              }`}
            >
              <Link
                to={
                  this.props.haveCurrentBase
                    ? ""
                    : " sidebar__item-icon--disabled"
                }
              >
                <Link
                  to={
                    this.props.haveCurrentBase
                      ? `/bases/${this.props.baseID}/cases`
                      : "/"
                  }
                >
                  <img className="icon-img-24" src={casesIcon} />
                </Link>
              </Link>
            </div>
          </div>
        </ProtectedScopedComponent>

        <ProtectedScopedComponent
          scopes={[
            "get:my-org-type-base:analytic",
            "get:my-org-type-base:analytic-case"
          ]}
        >
          <div className="sidebar__item">
            <div
              className={`sidebar__item-icon${
                this.props.haveCurrentBase
                  ? ""
                  : " sidebar__item-icon--disabled"
              }`}
            >
              <Link to={this.props.haveCurrentBase ? `/analytic` : "/"}>
                <img className="icon-img-24" src={chartIcon} />
              </Link>
            </div>
          </div>
        </ProtectedScopedComponent>

        <ProtectedScopedComponent
          scopes={["get:my-org-type-base:qualitative-feedback"]}
        >
          <div className="sidebar__item">
            <div
              className={`sidebar__item-icon${
                this.props.haveCurrentBase
                  ? ""
                  : " sidebar__item-icon--disabled"
              }`}
            >
              <Link to={this.props.haveCurrentBase ? `/feedback` : "/"}>
                <img className="icon-img-24" src={feedbackIcon} />
              </Link>
            </div>
          </div>
        </ProtectedScopedComponent>

        <div className="sidebar__seperator" />

        <ProtectedScopedComponent scopes={["list:my-org-type:base"]}>
          <div className="sidebar__item">
            <div className="sidebar__item-icon">
              <Link to="/bases">
                <img className="icon-img-24" src={basesIcon} />
              </Link>
            </div>
          </div>
        </ProtectedScopedComponent>

        <div className="sidebar__seperator" />

        <ProtectedScopedComponent scopes={["get:my-org:activity-report"]}>
          <div className="sidebar__item">
            <div className="sidebar__item-icon">
              <Link to="/activities-report">
                <img className="icon-img-24" src={activitiesReportIcon} />
              </Link>
            </div>
          </div>
        </ProtectedScopedComponent>

        <div className="sidebar__seperator" />

        <ProtectedScopedComponent scopes={["list:my-org:user"]}>
          <div className="sidebar__item">
            <div className="sidebar__item-icon">
              <Link to="/users">
                <img className="icon-img-24" src={userIcon} />
              </Link>
            </div>
          </div>
        </ProtectedScopedComponent>
      </div>
    </Fragment>
  );
}

Sidebar.propTypes = {
  baseID: PropTypes.number,
  notification: PropTypes.object,
  user: PropTypes.object,
  haveCurrentBase: PropTypes.bool
};

export default withRouter(
  connect(
    ({ notification, pageDetail, user }) => ({
      notification,
      user: user.data,
      haveCurrentBase: pageDetail.current.pageType === "base",
      baseID: pageDetail.current.detail.id
    }),
    () => ({})
  )(Sidebar)
);
