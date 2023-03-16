import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push, goBack } from "connected-react-router";
import { withRouter, Link, matchPath, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import {
  getTranslate,
  setActiveLanguage,
  getActiveLanguage
} from "react-localize-redux";
import track from "react-tracking";
import Modal from "react-modal";

import SearchPopover from "../components/search-popover/container";
import { componentName as CreateCaseName } from "../components/case-create";
import CreateCase from "../components/case-create/container";
import { showForm } from "@/ducks/forms";
import CreatePush from "../container/CreatePush";
import CreateBase from "../container/CreateBase";
import ChangePasswordForm from "./ChangePasswordForm";

import { setLogout, createUser, fetchRoleList } from "../actions/user";
import { showNotifications } from "../actions/notify";
import { webAuth } from "../auth/auth";

// import ringIcon from "../assets/icons/ring-black.svg";
import missmpLogo from "../assets/img/missmp_logo.png";
import audiLogo from "../assets/img/audi_logo.png";
import mercedesLogo from "../assets/img/mercedes_logo.png";
// import notificationIcon from "../assets/icons/ic-notification.svg";
// import notificationActiveIcon from "../assets/icons/ic-notification-active.svg";
import addActiveIcon from "../assets/icons/ic-circle-add-active.svg";
import searchIcon from "../assets/icons/ic-search.svg";
import backIcon from "../assets/icons/ic-back.svg";
import successIcon from "../assets/icons/ic-circle-success.svg";

//create new account
import CreateUserForm from "../components/CreateUserForm";
import { ProtectedScopedComponent } from "../components/HocComponent";

const matchPaths = (currentPath, paths = []) => {
  return (
    paths.findIndex(path =>
      matchPath(currentPath, {
        path: path,
        exact: true
      })
    ) !== -1
  );
};

@track({ module: "Header" })
class Header extends React.Component {
  state = {
    showBaseForm: false,
    showPushForm: false,
    showChangePasswordForm: false,
    showSuccessNoti: false,
    showCreateUserForm: false,
    roleArray: [],
    loadingCreateUser: false,
    errorCreateUser: ""
  };

  componentWillMount = () => {
    const roleList = this.props.fetchRoleList();
    if (roleList) {
      roleList.then(response => {
        this.setState({
          roleArray: response.data
        });
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname.split("/")[1] !== "search") {
      if (this.input) {
        this.input.value = "";
      }
    }
  }

  handleUser = values => {
    this.setState({
      loadingCreateUser: true
    });

    const org = this.props.getOrgName;
    this.props
      .createUser({
        email: values.email,
        name: values.email,
        realname: values.fullname,
        password: values.password,
        role: parseInt(values.role),
        org: org
      })
      .then(res => {
        console.log("res create: ", res);
        this.setState({
          loadingCreateUser: false,
          errorCreateUser: ""
        });
        setTimeout(() => {
          this.toggleCreateUserForm();
          window.location.reload();
        }, 1000);
      })
      .catch(({ response }) => {
        this.setState({
          loadingCreateUser: false,
          errorCreateUser: `${response.statusText} ${response.data.id}`
        });
      });
  };

  getLogo = () => {
    switch (this.props.user.orgName) {
      case "missmp":
        return missmpLogo;
      case "audi":
        return audiLogo;
      case "mercedes":
        return mercedesLogo;
    }
    return missmpLogo;
  };

  toggleBaseForm = () => {
    this.setState({ showBaseForm: !this.state.showBaseForm });
  };

  togglePushForm = () => {
    this.setState({ showPushForm: !this.state.showPushForm });
  };

  toggleChangePasswordForm = () => {
    this.setState({
      showChangePasswordForm: !this.state.showChangePasswordForm
    });
  };

  toggleCreateUserForm = () => {
    this.setState({
      showCreateUserForm: !this.state.showCreateUserForm,
      errorCreateUser: "",
      loadingCreateUser: false
    });
  };

  closeSuccessModal = () => {
    this.setState({ showSuccessNoti: false });
    setLogout("");
    webAuth.authorize();
  };

  toggleSuccessNoti = () => {
    this.setState({
      showSuccessNoti: true
    });
    setTimeout(this.closeSuccessModal, 4000);
  };

  switchLanguage = event => {
    this.props.setActiveLanguage(event.target.value);
    localStorage.setItem("language", event.target.value);
    window.location.reload();
  };

  switchPasstype = event => {
    // localStorage.setItem("passtype", event.target.value);
    this.props.changePasstype(event.target.value);
    // window.location.reload();
  };

  handleKeyDown = (e, path) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      const { value } = e.target;
      if (value == "") {
        return;
      }
      this.props.tracking.trackEvent({
        event: "search-attempt",
        value
      });
      this.props.push(`${path}${value}`);
    }
  };

  onShowCaseForm = () => {
    const { baseID, showForm } = this.props;
    this.refs.createCase.fetchData(parseInt(baseID));
    showForm(CreateCaseName);
  };

  @track({
    event: "logout-attempt"
  })
  logout = () => {
    this.props.setLogout();
  };

  render() {
    const customStyles = {
      content: {
        top: "50%",
        left: "50%",
        width: "fit-content",
        height: "fit-content",
        marginLeft: "-50px",
        marginRight: "-100px"
      }
    };
    const iconStyle = {
      position: "relative",
      left: "50%",
      width: "50px",
      marginLeft: "-25px",
      marginTop: "10px"
    };
    const { pathname } = this.props.location;
    const userData = JSON.parse(localStorage.getItem("userData"));
    const { translate, languages, currentLanguage, types, typeID } = this.props;
    const defaultInputValue =
      pathname.split("/")[1] === "search" && pathname.split("/")[2]
        ? pathname.split("/")[2]
        : "";

    const matchCase = matchPath(pathname, {
      path: "/case/:id"
    });

    const isMatchUsers = matchPaths(pathname, ["/users"]);

    const isCaseViews = matchPaths(pathname, [
      "/case/:id",
      "/bases/:baseID/cases"
    ]);

    const isBaseViews = matchPaths(pathname, ["/bases", "/"]);
    const isEditBaseViewRoot = matchPath(pathname, {
      path: "/bases/:baseID"
    });

    const isSearchBaseView = matchPaths(pathname, [
      "/search/bases/:searchTerm"
    ]);
    const isEditBaseViews = matchPaths(pathname, [
      "/bases/:baseID",
      "/bases/:baseID/passField",
      "/bases/:baseID/back",
      "/bases/:baseID/front",
      "/bases/:baseID/pushSchedule",
      "/bases/:baseID/params"
    ]);

    const HeaderIcon =
      matchCase && matchCase.isExact ? (
        <div className="header__icon header__icon--back">
          <a onClick={() => this.props.goBack()}>
            <img src={backIcon} />
          </a>
        </div>
      ) : (
        <div className="header__icon">
          <Link to="/">
            <img className="logo" src={`${this.getLogo()}`} />
          </Link>
        </div>
      );

    const Input = (
      <div className="header__banner__search">
        <img src={searchIcon} />
        <input
          className=""
          onKeyDown={e => {
            this.handleKeyDown(e, "/search/");
          }}
          placeholder={translate("searchCasesContain")}
          defaultValue={defaultInputValue}
          ref={input => (this.input = input)}
          required
        />
      </div>
    );

    const { loadingCreateUser, errorCreateUser } = this.state;
    const { roleArray } = this.state;

    return (
      <header className="header">
        {HeaderIcon}
        <div className="header__banner">
          {isCaseViews && (
            <ProtectedScopedComponent scopes={["list:my-org-type-base:case"]}>
              <div className="header__banner__item-group">
                <div className="header__content">{Input}</div>
              </div>
            </ProtectedScopedComponent>
          )}
          {!isCaseViews && !isEditBaseViews && (
            <ProtectedScopedComponent scopes={["list:my-org:type"]}>
              <div className="header__banner__item-group">
                <div className="header__content">
                  <div className="header__banner__text">
                    {translate("selected base")} {this.props.baseID || "N/A"} - {translate("type")}
                  </div>
                  <div
                    className="header__banner__option"
                    style={{ padding: "0px" }}
                  >
                    <select
                      className="rootLink"
                      value={typeID}
                      onChange={this.switchPasstype}
                    >
                      {types.data
                        ? types.data.map(type => {
                            return (
                              <option key={type.id} value={type.id}>
                                {type.memo}
                              </option>
                            );
                          })
                        : ""}
                    </select>
                  </div>
                </div>
              </div>
            </ProtectedScopedComponent>
          )}
          <div className="header__banner__item-group">
            {isEditBaseViews && (
              <ProtectedScopedComponent scopes={["get:my-org-type:base"]}>
                <div className="tabPannel-passTemplate header__content">
                  <div className="tabPannel-passTemplate__general">
                    <NavLink exact to={`${isEditBaseViewRoot.url}`}>
                      {translate("general")}
                    </NavLink>
                  </div>
                  <div className="tabPannel-passTemplate__field">
                    <NavLink to={`${isEditBaseViewRoot.url}/passField`}>
                      {translate("passFields")}
                    </NavLink>
                  </div>
                  <div className="tabPannel-passTemplate__front">
                    <NavLink to={`${isEditBaseViewRoot.url}/front`}>
                      {translate("front")}
                    </NavLink>
                  </div>
                  <div className="tabPannel-passTemplate__back">
                    <NavLink to={`${isEditBaseViewRoot.url}/back`}>
                      {translate("back")}
                    </NavLink>
                  </div>
                  <ProtectedScopedComponent
                    scopes={["list:my-org-type-base:steps"]}
                  >
                    <div className="tabPannel-passTemplate__push">
                      <NavLink to={`${isEditBaseViewRoot.url}/pushSchedule`}>
                        {translate("pushSchedule")}
                      </NavLink>
                    </div>
                  </ProtectedScopedComponent>
                  <div className="tabPannel-passTemplate__back">
                    <NavLink to={`${isEditBaseViewRoot.url}/params`}>
                      {translate("parameter")}
                    </NavLink>
                  </div>
                </div>
              </ProtectedScopedComponent>
            )}
          </div>
          <div className="header__banner__item-group">
            <div className="header__content">
              {isCaseViews ? (
                <ProtectedScopedComponent
                  scopes={["post:my-org-type-base:case"]}
                >
                  <div
                    className="header__banner__new-case"
                    onClick={() => this.onShowCaseForm()}
                  >
                    <a>
                      <div>{translate("createnewcase")}</div>
                      <img
                        className="icon-img--24 u-margin-left--9"
                        src={addActiveIcon}
                      />
                    </a>
                  </div>
                </ProtectedScopedComponent>
              ) : null}
              {isMatchUsers && (
                <ProtectedScopedComponent scopes={["create:my-org:user"]}>
                  <div
                    className="header__banner__new-case"
                    onClick={() => this.toggleCreateUserForm()}
                  >
                    <a>
                      <div>{translate("createnewaccount")}</div>
                      <img
                        className="icon-img--24 u-margin-left--9"
                        src={addActiveIcon}
                      />
                    </a>
                  </div>
                </ProtectedScopedComponent>
              )}
              {(isBaseViews || isSearchBaseView) && (
                <Fragment>
                  <div className="header__banner__search--mini">
                    <SearchPopover
                      searchPage="/search/bases"
                      placeHolder={translate("searchBasesContain")}
                    />
                  </div>

                  <ProtectedScopedComponent scopes={["post:my-org-type:base"]}>
                    <div
                      className="header__banner__new-case"
                      onClick={() => this.toggleBaseForm()}
                    >
                      <a>
                        <div>{translate("createBase")}</div>
                        <img
                          className="icon-img--24 u-margin-left--9"
                          src={addActiveIcon}
                        />
                      </a>
                    </div>
                  </ProtectedScopedComponent>

                  <ProtectedScopedComponent
                    scopes={["post:my-org-type-base:steps"]}
                  >
                    <div
                      className="header__banner__new-case"
                      onClick={() => this.togglePushForm()}
                    >
                      <a>
                        <div>{translate("createPush")}</div>
                        <img
                          className="icon-img--24 u-margin-left--9"
                          src={addActiveIcon}
                        />
                      </a>
                    </div>
                  </ProtectedScopedComponent>
                </Fragment>
              )}
              <div className="header__banner__lang">
                <select
                  className="rootLink"
                  value={currentLanguage}
                  onChange={this.switchLanguage}
                >
                  {languages
                    ? languages.map(language => {
                        return (
                          <option key={language.code} value={language.code}>
                            {language.code}
                          </option>
                        );
                      })
                    : ""}
                </select>
              </div>
              <div className="header__banner__user">
                <div className="header__banner__user__email">
                  {userData.email}
                </div>
                <div className="header__banner__user__dropdown">
                  <a onClick={this.toggleChangePasswordForm}>
                    {translate("changepassword")}
                  </a>
                  <p />
                  <a onClick={this.logout}>{translate("logout")}</a>
                </div>
              </div>
              {/*Create Case Modal*/}
              <CreateCase ref="createCase" />
              <ChangePasswordForm
                showChangePasswordForm={this.state.showChangePasswordForm}
                toggleChangePasswordForm={this.toggleChangePasswordForm}
                toggleSuccessNoti={this.toggleSuccessNoti}
              />
              <Modal
                isOpen={this.state.showSuccessNoti}
                onRequestClose={this.closeSuccessModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
                <div>
                  <h2>Change has been saved</h2>
                  <img style={iconStyle} src={successIcon} />
                </div>
              </Modal>
              <CreateBase
                showBaseForm={this.state.showBaseForm}
                toggleBaseForm={this.toggleBaseForm}
                typeID={typeID}
              />
              <CreateUserForm
                showCreateUserForm={this.state.showCreateUserForm}
                toggleCreateUserForm={this.toggleCreateUserForm}
                loading={loadingCreateUser}
                error={errorCreateUser}
                handleUser={this.handleUser}
                roleArray={roleArray}
                cancelLable={translate("cancel")}
                primaryButtonLable={translate("add")}
                roleLable={translate("role")}
                fullnameLable={translate("fullname")}
                pwLable={translate("pw")}
                emailLable={translate("email")}
                modalLable={translate("addnewmember")}
              />
              {this.state.showPushForm ? (
                <CreatePush
                  togglePushForm={this.togglePushForm}
                  typeID={typeID}
                />
              ) : null}
            </div>
          </div>
        </div>
      </header>
    );
  }
}

Header.defaultProps = {
  loading: false,
  error: ""
};

Header.propTypes = {
  types: PropTypes.object,
  user: PropTypes.object,
  setLogout: PropTypes.func,
  changePasstype: PropTypes.func,
  showNotifications: PropTypes.func,
  notification: PropTypes.object,
  submitNewCase: PropTypes.func,
  push: PropTypes.func,
  goBack: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  baseID: PropTypes.number,
  typeID: PropTypes.number,
  setActiveLanguage: PropTypes.func,
  translate: PropTypes.func,
  languages: PropTypes.array,
  currentLanguage: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.string,
  fetchRoleList: PropTypes.func,
  createUser: PropTypes.func,
  showForm: PropTypes.func,
  getOrgName: PropTypes.string
};

const mapState = state => ({
  notification: state.notification,
  translate: getTranslate(state.locale),
  languages: state.locale.languages,
  baseID: state.pageDetail.current.detail.id,
  types: state.typeOrg || { data: [] },
  user: state.user.data || { orgName: "" },
  currentLanguage: getActiveLanguage(state.locale).code,
  getOrgName: state.getOrgName.data
});

const mapDispatch = dispatch => {
  return {
    setLogout: bindActionCreators(setLogout, dispatch),
    showNotifications: bindActionCreators(showNotifications, dispatch),
    push: bindActionCreators(push, dispatch),
    goBack: bindActionCreators(goBack, dispatch),
    setActiveLanguage: bindActionCreators(setActiveLanguage, dispatch),
    createUser: bindActionCreators(createUser, dispatch),
    fetchRoleList: bindActionCreators(fetchRoleList, dispatch),
    showForm: bindActionCreators(showForm, dispatch)
  };
};

const HeaderRedux = connect(
  mapState,
  mapDispatch
)(Header);

export default withRouter(props => {
  console.log("withRouter Props: ", props);
  return <HeaderRedux {...props} />;
});

// export default HeaderRedux;
