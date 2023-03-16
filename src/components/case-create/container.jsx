import React, { Component } from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { getTranslate } from "react-localize-redux";
import { CASE_CREATE } from "../../constants/actionTypes";
import {
  getEmail,
  unflattenForm,
  flattenForm,
  createRule,
  translateCustom
} from "../../actions/utils";
import { submitNewCase, fetchCaseListByBase } from "../../actions/case";

import { pathOr } from "ramda";
import { subMinutes } from "date-fns";
import moment from "moment-timezone";
import axios from "axios";

import ss from "classnames";
import c from "./create-case.comp.scss";
import CreateCase, { propTypes } from "./index";

import {
  fetchBaseParam,
  fetchBaseWithoutStore as fetchBase
} from "@/actions/base";

export const convertDateTimePayLoad = (values, paramsPattern, timeZone) => {
  Object.keys(values.params).map(payloadParamName => {
    const paramPattern = paramsPattern.find(param => {
      return pathOr("", ["name"], param) === `params_${payloadParamName}`;
    });

    if (paramPattern.type === "date") {
      const offset = new Date().getTimezoneOffset();
      if (values.params[payloadParamName]) {
        let result = subMinutes(values.params[payloadParamName], offset);
        const zoneString = moment(new Date())
          .tz(timeZone)
          .format("Z");

        const zoneNumber = timeToDecimal(zoneString);
        result = subMinutes(result, zoneNumber * 60);

        values.params[payloadParamName] = result;
      }
    }
  });
};

export const timeToDecimal = t => {
  const arr = t.split(":");
  const dec = parseInt((arr[1] / 6) * 10, 10);

  return parseFloat(`${parseInt(arr[0], 10)}.${dec < 10 ? "0" : ""}${dec}`);
};

@connect(
  store => ({
    baseID: parseInt(store.pageDetail.current.detail.id, 10),
    orgName: pathOr("", ["user", "data", "orgName"], store),
    translate: getTranslate(store.locale)
  }),
  dispatch => {
    return {
      submitNewCase: bindActionCreators(submitNewCase, dispatch),
      push: bindActionCreators(push, dispatch),
      fetchCaseListByBase: bindActionCreators(fetchCaseListByBase, dispatch),
      fetchBaseParam: bindActionCreators(fetchBaseParam, dispatch),
      fetchBase: bindActionCreators(fetchBase, dispatch)
    };
  },
  null,
  {
    forwardRef: true
  }
)
export default class CreateCaseContainer extends Component {
  static propTypes = {
    ...propTypes,
    fetchCaseListByBase: PropTypes.func,
    push: PropTypes.func,
    submitNewCase: PropTypes.func,
    baseID: PropTypes.number,
    fetchBaseParam: PropTypes.func,
    fetchBase: PropTypes.func
  };

  state = {
    isRequesting: false,
    params: [],
    form: {},
    rules: {},
    updateForm: false,
    baseID: 0
  };

  tokenSource = undefined;

  fetchData = baseID => {
    this.setState({
      isRequesting: true
    });
    this.tokenSource = axios.CancelToken.source();

    this.props.fetchBase(baseID).then(res => {
      // fetch list param of base
      this.props
        .fetchBaseParam(baseID, this.tokenSource.token)
        .then(baseParams => {
          const newFormData = this.setupForm(baseParams, baseID);
          this.setState({
            isRequesting: false,
            baseID,
            baseTimeZone: pathOr("", ["timeZone"], res), // timezone of face
            ...newFormData
          });
        });
    });
  };

  setupForm = (listParams, baseID) => {
    // sort list params
    listParams = listParams.sort(
      (before, after) => before.orderNum - after.orderNum
    );

    // create form model
    // Hardcode
    let form = {
      test: false,
      createdBy: getEmail(),
      baseID: baseID || null,
      alternativeId: ""
    };

    // flatten Form
    form = flattenForm(form, listParams, "params");

    // add label for extra params
    listParams.map((param, index) => {
      listParams[index].label = (
        <span>
          {translateCustom(
            this.props.translate,
            param.label ? param.label : param.name
          )}
          <span className={ss(c.description)}>
            {translateCustom(this.props.translate, param.description)}
          </span>
        </span>
      );

      listParams[index].name = `params_${param.name}`;
    });

    // Hardcode static field
    listParams = [
      {
        name: "alternativeId",
        label: this.props.translate("caseid"),
        type: "text",
        visible: true
      },
      ...listParams,
      {
        name: "test",
        label: this.props.translate("checkboxtest"),
        type: "checkbox",
        visible: true
      }
    ];

    const rules = createRule(
      listParams,
      this.props.translate,
      this.props.orgName
    );

    return {
      params: listParams,
      rules,
      form,
      updateForm: !this.state.updateForm
    };
  };

  resetState = form => {
    if (this.tokenSource) {
      this.tokenSource.cancel("");
    }
    Object.keys(form).map(fieldKey => {
      if (fieldKey !== "createdBy" && fieldKey !== "baseID") {
        form[fieldKey] = "";
      }
      if (fieldKey === "test") {
        form[fieldKey] = false;
      }
    });

    return { form, params: [], rules: {} };
  };

  submitNewCase = ({ values, closeModal }) => {
    values = unflattenForm(values, "params");
    const { params, baseTimeZone } = this.state;
    convertDateTimePayLoad(values, params, baseTimeZone);
    this.setState({ isRequesting: true });
    values = { baseID: parseInt(values.baseID, 10), ...values };
    this.props
      .submitNewCase({ values })
      .then(res => {
        this.setState({ isRequesting: false });
        if (res.type === CASE_CREATE.SUCCESS) {
          closeModal();
          this.props.fetchCaseListByBase({
            baseID: parseInt(values.baseID, 10)
          });
          console.log(res);
        }
      })
      .catch(err => console.log(err));
  };

  render = () => {
    const {
      isRequesting,
      params,
      rules,
      form,
      updateForm,
      baseTimeZone
    } = this.state;
    const { translate } = this.props;
    return (
      <CreateCase
        {...this.props}
        onSubmit={value => this.submitNewCase(value)}
        isRequesting={isRequesting}
        inputParams={params}
        rules={rules}
        form={form}
        resetState={this.resetState}
        labelButton={translate("createbutton").toUpperCase()}
        title={translate("createnewcase")}
        updateForm={updateForm}
        timeZone={baseTimeZone}
      />
    );
  };
}
