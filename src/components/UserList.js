/* eslint-disable react/no-multi-comp */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import configs from "../constants/orgConfigs.js";
import moreOptIcon from "../assets/icons/ic-circle-more-option.svg";
import { ProtectedScopedComponent } from "./HocComponent";

const mapViewField = (item, key, translate) => {
  // const color = "#f08262";
  return {
    realname: (
      <td key={key} className="realname">
        {item.realname}
      </td>
    ),
    email: (
      <td key={key} className="email">
        {item.email}
      </td>
    ),
    role: (
      <td key={key} className="role">
        {item.role.name}
      </td>
    ),
    // team: (
    //   <td key={key} className="team">
    //     {item.team}
    //   </td>
    // ),
    active: (
      <td key={key} className="team">
        {item.active ? (
          <span className="capitalizes__first-letter">
            <span className="dot-active" />
            {translate("active")}
          </span>
        ) : (
          <span className="capitalizes__first-letter">
            <span className="dot-blocked" />
            {translate("blocked")}
          </span>
        )}
      </td>
    )
  };
};

const mapColumnName = fieldKey => {
  const mapNameDefinition = [
    {
      name: "name",
      keys: ["realname"]
    },
    {
      name: "email",
      keys: ["email"]
    },
    {
      name: "role",
      keys: ["role"]
    },
    // {
    //   name: "team",
    //   keys: ["team"]
    // },
    {
      name: "status",
      keys: ["active"]
    }
  ];
  const defIndex = mapNameDefinition.findIndex(def =>
    def.keys.includes(fieldKey)
  );
  return defIndex === -1 ? fieldKey : mapNameDefinition[defIndex].name;
};

@connect(
  store => ({
    getOrgName: store.getOrgName.data
  }),
  () => {}
)
class UserList extends Component {
  render() {
    const {
      users,
      blockUser,
      activeUser,
      toogleEditUserForm,
      translate,
      getOrgName
    } = this.props;
    const org = getOrgName;
    const fields =
      (configs[org].display.userList &&
        configs[org].display.userList.userListFields) ||
      configs.default.display.userList.userListFields;
    console.log("HARDCODE User list in json", users);

    return (
      <table className="table table--default">
        <thead>
          <tr className="table__head">
            {fields.map((field, index) => (
              <th
                className={field === "update" ? "update" : ""}
                key={index}
                // onClick={this.sortCol(field)}
              >
                {translate(mapColumnName(field))}
                {/* <img
                className="icon-img--18 u-margin-left--6 u-text-align--right"
                src={sortIcon}
                style={{ visibility: "hidden" }}
              /> */}
              </th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map(item => (
            <UserItem
              key={item.id}
              item={item}
              fields={fields}
              blockUser={blockUser}
              activeUser={activeUser}
              toogleEditUserForm={toogleEditUserForm}
              translate={translate}
            />
          ))}
        </tbody>
      </table>
    );
  }
}

class UserItem extends Component {
  state = {
    showDropdownList: false
  };

  changeStatus = (callbackFunc, userID) => {
    callbackFunc(userID);
    this.setState({
      showDropdownList: false
    });
  };

  render() {
    const {
      item,
      fields,
      activeUser,
      blockUser,
      toogleEditUserForm,
      translate
    } = this.props;
    return (
      <tr className="table__row">
        {fields.map(
          (field, index) => mapViewField(item, index, translate)[field]
        )}
        <td className="u-text-align--right">
          <div
            className="dropdown_container"
            onMouseLeave={() =>
              this.setState({
                showDropdownList: false
              })
            }
          >
            <img
              onMouseEnter={() =>
                this.setState({
                  showDropdownList: true
                })
              }
              className="icon-img--24 u-margin-left--12 u-text-align--right dropdown_icon"
              src={moreOptIcon}
            />
            {this.state.showDropdownList && (
              <div className="dropdown_list u-text-align--left">
                {item.active ? (
                  <ProtectedScopedComponent scopes={["update:my-org:user"]}>
                    <a
                      onClick={() => this.changeStatus(blockUser, item.id)}
                      className="capitalizes__first-letter"
                    >
                      {translate("blockUser")}
                    </a>
                  </ProtectedScopedComponent>
                ) : (
                  <ProtectedScopedComponent scopes={["update:my-org:user"]}>
                    <a
                      onClick={() => this.changeStatus(activeUser, item.id)}
                      className="capitalizes__first-letter"
                    >
                      {translate("activeUser")}
                    </a>
                  </ProtectedScopedComponent>
                )}

                <p />
                <ProtectedScopedComponent scopes={["update:my-org:user"]}>
                  <a onClick={() => toogleEditUserForm(item)}>
                    {translate("Edit")}
                  </a>
                </ProtectedScopedComponent>
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  }
}

UserList.propTypes = {
  users: PropTypes.array,
  translate: PropTypes.func,
  activeUser: PropTypes.func,
  blockUser: PropTypes.func,
  toogleEditUserForm: PropTypes.func,
  getOrgName: PropTypes.string
};

UserItem.propTypes = {
  item: PropTypes.object,
  fields: PropTypes.array,
  activeUser: PropTypes.func,
  blockUser: PropTypes.func,
  toogleEditUserForm: PropTypes.func,
  translate: PropTypes.func
};

export default UserList;
