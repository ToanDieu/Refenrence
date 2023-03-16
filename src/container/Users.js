import React from "react";
import PropTypes from "prop-types";
// import config from "../../appConfig";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import Path from "ramda/src/path";
import {
  fetchUserListByOrg,
  blockUserByID,
  activeUserByID,
  fetchRoleList,
  editUser,
  changeUserPassword
} from "../actions/user";
import Loading from "../components/Loading";
import UserList from "../components/UserList";
// import CreateUserForm from "../components/CreateUserForm";
import Pagination from "./Pagination";
import PopUpForm from "../components/popup-form";
import { FormContent } from "../components/form";

class Users extends React.Component {
  state = {
    userList: {
      loading: true
    },
    showEditUserForm: false,
    loadingEditUser: false,
    errorEditUser: "",
    errorChangeUserPassword: "",
    userToEdit: null
  };

  componentWillMount() {
    const numItem = 100;
    this.setState({
      numItem
    });

    this.props.fetchUserListByOrg({ numItem }).then(res => {
      const userList = Object.assign(res.userList, { loading: false });
      this.setState({
        userList
      });
    });

    this.props.fetchRoleList().then(response => {
      this.setState({
        roleArray: response.data
      });
    });
  }

  /* Hanlde pagination */
  gotoPage = page => {
    const numItem = this.state.numItem || 10;
    this.props.fetchUserListByOrg({ page, numItem }).then(res => {
      const userList = Object.assign(res.userList, { loading: false });
      this.setState({
        userList
      });
    });
  };

  handleChangeNumItem = numItem => {
    this.setState({
      numItem
    });
    this.props.fetchUserListByOrg({ numItem }).then(res => {
      const userList = Object.assign(res.userList, { loading: false });
      this.setState({
        userList
      });
    });
  };

  stepPage = (next, currentPage, maxPage) => {
    if (next) {
      if (currentPage < maxPage) {
        this.gotoPage(currentPage + 1);
      }
    } else if (currentPage > 1) {
      this.gotoPage(currentPage - 1);
    }
  };
  /* */

  // Reverse user status after activate/deactivate user
  processUserStatus = userID => {
    const { userList } = this.state;
    const user = userList.data.data.filter(user => {
      return user.id == userID;
    });
    if (user.length > 0) {
      user[0].active = !user[0].active;
    }
    this.setState({
      userList
    });
  };

  activeUser = userID => {
    this.props
      .activeUserByID({ userID })
      .then(() => {
        this.processUserStatus(userID);
      })
      .catch(err => {
        console.log(err);
      });
  };

  blockUser = userID => {
    this.props
      .blockUserByID({ userID })
      .then(() => {
        this.processUserStatus(userID);
      })
      .catch(err => {
        console.log(err);
      });
  };

  toogleEditUserForm = user => {
    this.setState({
      showEditUserForm: !this.state.showEditUserForm,
      errorEditUser: "",
      errorChangeUserPassword: "",
      loadingEditUser: false,
      userToEdit: user
    });
  };

  saveUser = values => {
    this.setState({
      loadingEditUser: true
    });

    const params = {
      id: this.state.userToEdit.id,
      data: {
        realname: values.realname,
        role: parseInt(values.role)
      }
    };

    this.props
      .editUser(params)
      .then(res => {
        const { userList } = this.state;
        const userAfterEdit = res.data;
        const user = userList.data.data.filter(user => {
          return user.id == userAfterEdit.id;
        });
        if (user.length > 0) {
          user[0].realname = userAfterEdit.realname;
          user[0].role = userAfterEdit.role;
        }
        this.setState({
          userList
        });
        this.toogleEditUserForm();
      })
      .catch(err => {
        this.setState({
          loadingEditUser: false,
          showEditUserForm: true,
          errorEditUser: err.message
        });
      });
  };

  changeUserPassword = values => {
    this.setState({
      loadingEditUser: true
    });

    const params = {
      newPassword: values.newpassword
    };

    this.props
      .changeUserPassword({
        userID: this.state.userToEdit.id,
        params
      })
      .then(() => {
        this.toogleEditUserForm();
      })
      .catch(err => {
        this.setState({
          loadingEditUser: false,
          showEditUserForm: true,
          errorChangeUserPassword: err.message
        });
      });
  };

  mappingData = userToEdit => {
    const { translate } = this.props;

    if (userToEdit) {
      return [
        {
          name: "email",
          label: translate("email"),
          disabled: true,
          value: userToEdit.email,
          type: "email",
          required: {
            error: translate("fillOutThisField"),
            validateFunc: values => {
              if (values.email.trim().replace(" ", "").length === 0) {
                return translate("fillOutThisField");
              }
            }
          }
        },
        {
          name: "realname",
          label: translate("fullname"),
          value: userToEdit.realname,
          type: "text",
          required: {
            error: translate("fillOutThisField"),
            validateFunc: values => {
              if (values.realname.trim().replace(" ", "").length === 0) {
                return translate("fillOutThisField");
              }
            }
          }
        },
        {
          name: "role",
          label: translate("role"),
          value: userToEdit.role.id,
          type: "options",
          options: this.state.roleArray,
          required: {
            error: translate("fillOutThisField")
          }
        }
      ];
    }
    return [];
  };

  validatePassword = password => {
    const { translate } = this.props;
    if (password) {
      if (password.trim().replace(" ", "").length === 0) {
        return translate("fillOutThisField");
      }
      if (password.includes(" ")) {
        return "(*) Password cannot contain spaces";
      }
      if (password.length < 8 || password.length > 128) {
        return translate("passwordLengthMustBe");
      }
    } else {
      return translate("fillOutThisField");
    }
  };

  render() {
    const { userList } = this.state;
    const { translate } = this.props;
    const users = Path(["data", "data"], userList);
    const pageSize = Path(["data", "size"], userList);

    const userInfo = this.mappingData(this.state.userToEdit);
    const changePasswordForm = [
      {
        name: "newpassword",
        label: translate("newpassword"),
        value: "",
        type: "password",
        required: {
          error: translate("fillOutThisField"),
          validateFunc: values => {
            if (values.newpassword.trim().replace(" ", "").length === 0) {
              return translate("fillOutThisField");
            }
            return this.validatePassword(values.newpassword);
          }
        }
      },
      {
        name: "cofirmpassword",
        label: translate("confirmpassword"),
        value: "",
        type: "password",
        required: {
          error: translate("fillOutThisField"),
          validateFunc: values => {
            if (values.cofirmpassword.trim().replace(" ", "").length === 0) {
              return translate("fillOutThisField");
            }
            if (values.newpassword != values.cofirmpassword) {
              return "Your password don't match.";
            }
            return this.validatePassword(values.newpassword);
          }
        }
      }
    ];
    return (
      <div className="home">
        <div className="home__content">
          <div className="container-wide">
            <div className="page">
              <div className="page__title u-margin-bottom--22">
                <div className="page__title-left">
                  {translate("User")}
                  <span className="page__title-count u-margin-left--9">
                    {pageSize || null}
                  </span>
                </div>
              </div>
              {userList.loading ? (
                <Loading />
              ) : users && users.length ? (
                <div>
                  <UserList
                    users={users}
                    translate={translate}
                    activeUser={this.activeUser}
                    blockUser={this.blockUser}
                    toogleEditUserForm={this.toogleEditUserForm}
                    userToEdit={this.state.userToEdit}
                  />
                  <Pagination
                    page={userList.data}
                    gotoPage={this.gotoPage}
                    stepPage={this.stepPage}
                    handleChangeNumItem={this.handleChangeNumItem}
                    selected={this.state.numItem || 100}
                  />
                </div>
              ) : userList.error ? (
                userList.error
              ) : (
                "no data"
              )}
            </div>
          </div>
        </div>
        <PopUpForm
          mainLabel={translate("account_setting_label")}
          showForm={this.state.showEditUserForm}
          toggleCloseForm={this.toogleEditUserForm}
          tabsLabel={["Info", translate("changePassword")]}
        >
          {/* Info Tab */}
          <FormContent
            showForm={this.state.showEditUserForm}
            submitHandle={this.saveUser}
            cancelHandle={this.toogleEditUserForm}
            loading={this.state.loadingEditUser}
            errorMessage={this.state.errorEditUser}
            cancelLable={translate("cancel")}
            primaryButtonLable={translate("save")}
            fields={userInfo}
          />
          {/* Change password Tab */}
          <FormContent
            showForm={this.state.showEditUserForm}
            submitHandle={this.changeUserPassword}
            cancelHandle={this.toogleEditUserForm}
            loading={this.state.loadingEditUser}
            errorMessage={this.state.errorChangeUserPassword}
            cancelLable={translate("cancel")}
            primaryButtonLable={translate("save")}
            fields={changePasswordForm}
          />
        </PopUpForm>
      </div>
    );
  }
}

Users.propTypes = {
  fetchUserListByOrg: PropTypes.func,
  activeUserByID: PropTypes.func,
  blockUserByID: PropTypes.func,
  fetchRoleList: PropTypes.func,
  editUser: PropTypes.func,
  translate: PropTypes.func,
  getLanguage: PropTypes.func,
  changeUserPassword: PropTypes.func
};

const mapState = state => ({
  translate: getTranslate(state.locale)
});

const mapDispatch = dispatch => {
  return {
    fetchUserListByOrg: bindActionCreators(fetchUserListByOrg, dispatch),
    activeUserByID: bindActionCreators(activeUserByID, dispatch),
    blockUserByID: bindActionCreators(blockUserByID, dispatch),
    fetchRoleList: bindActionCreators(fetchRoleList, dispatch),
    editUser: bindActionCreators(editUser, dispatch),
    changeUserPassword: bindActionCreators(changeUserPassword, dispatch)
  };
};

export default connect(
  mapState,
  mapDispatch
)(Users);
