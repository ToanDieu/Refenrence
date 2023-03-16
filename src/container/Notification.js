import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchOldNotifications } from "../actions/notify";
import { bindActionCreators } from "redux";
import { pathOr, compose, identity, ifElse, equals, type } from "ramda";
import format from "date-fns/format";
import Loading from "../components/Loading";
import { getTranslate } from "react-localize-redux";

class Noti extends React.Component {
  componentWillMount() {
    const baseID = this.props.baseID;
    const { notification } = this.props;
    if (!notification.isPreloaded) {
      this.props.fetchOldNotifications({ baseID });
    }
  }

  render() {
    const { notification, translate } = this.props;
    return (
      <div className="home">
        <div className="home__content">
          <div className="container-wide">
            <h1 className="page-title u-margin-bottom--22">
              Base {this.props.baseID} | {translate("notification")}
            </h1>
            <div>
              {notification.events.length ? (
                <table className="table table--default">
                  <thead className="table__head">
                    <tr>
                      <th>{translate("caseid")}</th>
                      <th>{translate("step")}</th>
                      <th>{translate("message")}</th>
                      <th>{translate("date")}</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {notification.events.map(event => {
                      return (
                        <tr key={event.id} className="table__row">
                          <td>
                            {/**
                             * ? CONSIDERING
                             * full functional implement or just check prop available to use
                             */}
                            {compose(
                              ifElse(
                                compose(
                                  equals("Object"),
                                  type
                                ),
                                pathOr("", ["alternativeId"]),
                                identity
                              ),
                              pathOr(event, ["meta", "detail", "alternativeId"])
                            )(event)}
                          </td>
                          <td>{event.meta.case.step}</td>
                          <td>{event.detail}</td>
                          <td>
                            {format(event.createdAt, "MMM DD, YYYY, HH:mm:ss")}
                          </td>
                          <td>
                            <Link
                              key={event.meta.case.id}
                              to={`/case/${event.meta.case.id}`}
                            >
                              {translate("view")}
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div>
                  {!notification.isPreloaded ? <Loading /> : "No notification"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Noti.propTypes = {
  baseID: PropTypes.number,
  fetchOldNotifications: PropTypes.func,
  notification: PropTypes.object,
  translate: PropTypes.func,
  getLanguage: PropTypes.func
};

const mapState = state => ({
  baseID: state.pageDetail.current.detail.id,
  notification: state.notification,
  translate: getTranslate(state.locale)
});

const mapDispatch = dispatch => {
  return {
    fetchOldNotifications: bindActionCreators(fetchOldNotifications, dispatch)
  };
};

export default connect(
  mapState,
  mapDispatch
)(Noti);
