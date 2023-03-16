import { setLogout } from "./user";
import { pathOr } from "ramda";
import Path from "ramda/src/path";
import orgConfigs from "@/constants/orgConfigs";
import * as types from "@/constants/actionTypes";
import {
  timeRegex,
  phonePatternStandard,
  phonePatternWithVnDomain
} from "@/constants/index";
import config from "../appConfig";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { addMinutes } from "date-fns";
import de from "@/i18n/de.json";
import en from "@/i18n/en.json";
import { isNumber } from "@/utils/checkNumber";

export const createAction = actionType => payload => ({
  type: actionType,
  payload
});

const logoutStatuses = [401, 403];

export const catchHandler = (type, error, dispatch) => {
  if (error.response) {
    if (logoutStatuses.indexOf(error.response.status) > -1) {
      dispatch(setLogout("Auth token expired"));
    } else {
      dispatch(createAction(type)(error.response.status));
    }
  } else if (error.request) {
    dispatch(createAction(type)(error.request));
  } else {
    dispatch(createAction(type)(error.message));
  }
};

export function asyncActionCreator(asyncTypes, createThunk) {
  return (...args) => {
    const thunk = createThunk(...args);

    return dispatch => {
      dispatch({
        type: asyncTypes.REQUEST
      });

      return dispatch(thunk)
        .then(payload =>
          dispatch({
            type: asyncTypes.SUCCESS,
            payload: payload.data
          })
        )
        .catch(error => catchHandler(asyncTypes.FAILURE, error, dispatch));
    };
  };
}

export function defaultHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  };
}

export function getOrg(email) {
  //! HACK for test account
  const tGroup = /.*\+(:?.*-)org-(.*)@\w+\.\w+/g.exec(email);
  if (tGroup !== null) {
    return tGroup[2];
  }
  const regex = /@(\w+)(?=\.)/g;
  return email.match(regex)[0].split("@")[1];
}

export function getOrgFromStorage() {
  const userRaw = localStorage.getItem("userData");
  const user = JSON.parse(userRaw);
  return getOrg(user.email);
}

export function getEmail() {
  const userRaw = localStorage.getItem("userData");
  const user = JSON.parse(userRaw);
  return user.email;
}
export function getLanguage() {
  const language = localStorage.getItem("language");
  if (!language) {
    localStorage.setItem("language", "en");
    return "en";
  }
  return language;
}

export function checkField(data, path) {
  const check = Path(path || []);
  return check(data);
}

export function checkDisabledComponent(componentCodeName, orgName) {
  const listDisable = orgConfigs[orgName].disabledComponents;
  let disable = false;

  listDisable.map(value => {
    if (value == componentCodeName) {
      disable = true;
    }
  });

  return disable;
}

export function isContainScope(scope) {
  let scopeArray = [];
  if (localStorage.getItem("token")) {
    scopeArray = jwtDecode(
      JSON.stringify(localStorage.getItem("token"))
    ).scope.split(" ");
  }

  if (!scope) {
    return true;
  }

  // Hardcode to testing
  // const scopeArray = ` list:my-org-type:base list:my-org-type-base:notification list:my-org:user list:my-org-type-base:case
  // get:my-org-type-base:analytic list:my-org:type get:my-org-type:base post:my-org-type-base:case post:my-org-type:base post:my-org-type-base:steps
  //  list:my-org-type-base:steps put:my-org-type:base delete:my-org-type-base:steps get:my-org-type-base:case list:my-org-type-base:case
  //  patch:my-org-type-base:case create:my-org:user update:my-org:user
  // `.split(` `);

  return scopeArray.indexOf(scope) !== -1;
}

export function getRoutePath(pageName, orgName) {
  if (orgName && orgConfigs[orgName].routes[pageName].url) {
    return orgConfigs[orgName].routes[pageName].url;
  }

  return "";
}

export function getDefaultSetting(key, orgName) {
  return pathOr(undefined, [orgName, "defaultSetting", key], orgConfigs);
}

export function unflattenForm(form, key) {
  const newForm = {};
  newForm[key] = {};
  Object.keys(form).map(keyForm => {
    if (keyForm.indexOf(`${key}_`) < 0) {
      newForm[keyForm] = form[keyForm];
    } else {
      newForm.params[keyForm.substring(`${key}_`.length, keyForm.length)] =
        form[keyForm];
    }
  });

  return newForm;
}

export function flattenForm(form, extraFields, key) {
  const newForm = { ...form };
  extraFields.map(extrafield => {
    if (extrafield.type === "date" && pathOr("", ["value"], extrafield)) {
      const offset = new Date().getTimezoneOffset();
      newForm[`${key}_${extrafield.name}`] = addMinutes(
        pathOr("", ["value"], extrafield),
        offset
      );
    } else {
      newForm[`${key}_${extrafield.name}`] = pathOr("", ["value"], extrafield);
    }
  });

  return newForm;
}

export function createRule(listField, translate, orgName) {
  const rules = {};
  listField.map(field => {
    const rule = [];
    if (pathOr(false, ["required"], field)) {
      rule.push({
        required: true,
        message: translate("required"),
        trigger: "onchange",
        validator: (rule, value, callback) => {
          if (value.replace(" ", "").trim().length === 0) {
            callback(new Error(translate("required")));
          } else {
            callback();
          }
        }
      });
    }

    // let validatorFunc;
    switch (field.type) {
      case "email": {
        const emailPattern = /^[\w/.+-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,4}$/;
        rule.push({
          validator: (rule, value, callback) => {
            if (!value || value === "") {
              callback();
            } else if (value.includes(" ")) {
              callback(new Error(translate("nowhitespace")));
            } else if (!emailPattern.test(value)) {
              callback(new Error(translate("invalidValue")));
            } else {
              callback();
            }
          }
        });
        break;
      }
      case "mobileNumber": {
        const preNumbers = pathOr(
          [],
          [orgName, "validate", "mobileNumber"],
          orgConfigs
        );

        rule.push({
          validator: (rule, value, callback) => {
            if (!value || value === "") {
              callback();
            } else if (value.includes(" ")) {
              callback(new Error(translate("nowhitespace")));
            } else {
              let matchWithOrg = false;
              preNumbers.map(preNumber => {
                const phonePatternWithDomainCode = new RegExp(
                  `^\\+${preNumber}\\d{8,13}$`
                );
                if (phonePatternWithDomainCode.test(value)) {
                  matchWithOrg = true;
                }
              });
              if (
                !phonePatternStandard.test(value) &&
                !phonePatternWithVnDomain.test(value) &&
                !matchWithOrg
              ) {
                callback(new Error(translate("invalidphonenumber")));
              } else {
                callback();
              }
            }
          }
        });
        break;
      }
      case "number": {
        rule.push({
          validator: (rule, value, callback) => {
            if (!value || value === "") {
              callback();
            } else if (!isNumber(value)) {
              callback(new Error(translate("onlyDigits")));
            } else {
              callback();
            }
          }
        });
        break;
      }
      case "duration": {
        rule.push({
          validator: (rule, value, callback) => {
            if (!value || value === "") {
              callback();
            } else if (!timeRegex.test(value)) {
              callback(new Error(translate("actionDelayFormatMess")));
            } else {
              callback();
            }
          }
        });
        break;
      }
      default:
        break;
    }

    rules[field.name] = rule;
  });

  return rules;
}

export function translateCustom(translate, key) {
  if (de[key] && en[key]) {
    translate(key);
  }
  return key;
}

export const getVersion = asyncActionCreator(types.GET_VERSION, () => () => {
  const url = new URL(config.TSE_API);
  return axios.get(`${url.origin}/version`, {
    headers: defaultHeaders()
  });
});
