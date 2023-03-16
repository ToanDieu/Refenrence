import React, { Component } from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";

import { pathOr } from "ramda";
import { addMinutes } from "date-fns";
import moment from "moment-timezone";
import ss from "classnames";

// import UpdateCase, { propTypes } from "./index";
import c from "./update-case.comp.scss";
import CreateCase from "@/components/case-create";
import {
  unflattenForm,
  flattenForm,
  createRule,
  translateCustom
} from "@/actions/utils";
import { fetchCaseParam } from "@/actions/case";
import {
  convertDateTimePayLoad,
  timeToDecimal
} from "@/components/case-create/container";

import { updateCase } from "@/ducks/cases";
import {
  fetchBaseWithoutStore as fetchBase,
  fetchBaseParam
} from "@/actions/base";
import icWarning from "./icons/ic-warning.svg";

export const convertDateTimeUTCtoGMT = (inputForm, listParams, timeZone) => {
  if (!timeZone) {
    return;
  }

  const form = inputForm;
  listParams.map(param => {
    if (pathOr(false, [param.name], form) && param.type === "date") {
      const zoneString = moment(new Date())
        .tz(timeZone)
        .format("Z");

      const zoneNumber = timeToDecimal(zoneString);
      const result = addMinutes(form[param.name], zoneNumber * 60);
      form[param.name] = result;
    }

    return null;
  });
};

@connect(
  store => ({
    orgName: pathOr("", ["user", "data", "orgName"], store),
    translate: getTranslate(store.locale)
  }),
  dispatch => {
    return {
      updateCase: bindActionCreators(updateCase, dispatch),
      fetchBase: bindActionCreators(fetchBase, dispatch),
      fetchBaseParam: bindActionCreators(fetchBaseParam, dispatch),
      fetchCaseParam: bindActionCreators(fetchCaseParam, dispatch)
    };
  },
  null,
  {
    forwardRef: true
  }
)
export default class UpdateCaseContainer extends Component {
  static propTypes = {
    orgName: PropTypes.string.isRequired,
    caseId: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    updateCase: PropTypes.func.isRequired,
    didUpdate: PropTypes.func.isRequired,
    fetchBase: PropTypes.func.isRequired,
    baseID: PropTypes.number.isRequired,
    fetchCaseParam: PropTypes.func.isRequired,
    fetchBaseParam: PropTypes.func.isRequired,
    alternativeId: PropTypes.string.isRequired
  };

  state = {
    isRequesting: false,
    listFields: [],
    rules: {},
    updateForm: false
  };

  componentDidMount() {
    this.fetchBase(this.props.baseID);
  }

  fetchData = (baseID, caseID) => {
    this.setState({ isRequesting: true });
    const {
      alternativeId,
      fetchCaseParam: fetchCaseParamDB,
      fetchBaseParam: fetchBaseParamDB
    } = this.props;

    fetchBaseParamDB(baseID).then(baseParamsRes => {
      let baseParams = baseParamsRes;
      fetchCaseParamDB(caseID).then(caseParams => {
        baseParams.map((baseParam, index) => {
          baseParams[index].value = pathOr("", [baseParam.name], caseParams);

          return null;
        });

        baseParams = baseParams.sort(
          (before, after) => before.orderNum - after.orderNum
        );

        this.setupForm({
          alternativeId,
          params: [...baseParams]
        });
      });
    });
  };

  fetchBase = baseID => {
    const { fetchBase: fetchBaseDB } = this.props;
    fetchBaseDB(baseID).then(res => {
      this.setState({
        baseTimeZone: pathOr("", ["timeZone"], res) // timezone of face
      });
    });
  };

  setupForm = defaultvalues => {
    const { translate, orgName } = this.props;
    const { baseTimeZone, updateForm } = this.state;
    // setup form
    // flatten Form
    const form = flattenForm(defaultvalues, defaultvalues.params, "params");
    delete form.params;

    let listParams = pathOr([], ["params"], defaultvalues);

    // add label for extra params
    const newListParams = listParams.map(param => {
      return {
        ID: param.ID,
        baseID: param.baseID,
        label: (
          <span>
            {translateCustom(translate, param.label ? param.label : param.name)}
            <span className={ss(c.description)}>
              {translateCustom(translate, param.description)}
            </span>
          </span>
        ),
        name: `params_${param.name}`,
        orderNum: param.orderNum,
        type: param.type,
        required: param.required,
        visible: pathOr(false, ["visible"], param)
      };
    });

    listParams = newListParams;

    // Hardcode static field
    listParams = [
      {
        name: "alternativeId",
        label: translate("caseid"),
        type: "text",
        value: pathOr("", ["alternativeId"], defaultvalues),
        visible: true
      },
      ...listParams
    ];

    convertDateTimeUTCtoGMT(form, listParams, baseTimeZone);
    const rules = createRule(listParams, translate, orgName);

    this.setState({
      listFields: listParams,
      rules,
      form,
      updateForm: !updateForm,
      isRequesting: false
    });
  };

  updateCase = ({ values, closeModal }) => {
    const payload = unflattenForm(values, "params");
    const { listFields, baseTimeZone } = this.state;
    const { updateCase: updateCaseDB, caseId, didUpdate } = this.props;
    convertDateTimePayLoad(payload, listFields, baseTimeZone);
    this.setState({ isRequesting: true });
    return updateCaseDB({
      caseId,
      payload
    }).then(() => {
      closeModal();
      didUpdate();
      return this.setState({ isRequesting: false });
    });
  };

  resetState = inputForm => {
    if (this.tokenSource) {
      this.tokenSource.cancel("");
    }

    const form = inputForm;
    Object.keys(form).map(fieldKey => {
      if (fieldKey !== "createdBy" && fieldKey !== "baseID") {
        form[fieldKey] = "";
      }
      if (fieldKey === "test") {
        form[fieldKey] = false;
      }

      return null;
    });

    return { form, params: [], rules: {} };
  };

  render = () => {
    const {
      isRequesting,
      rules,
      form,
      listFields,
      updateForm,
      baseTimeZone
    } = this.state;
    const { translate } = this.props;
    const extraButtons = [
      <img key="1" alt="Warning" src={icWarning} />,
      <p key="2">{translate("editcasewarning")}</p>
    ];

    return (
      <CreateCase
        // {...this.props}
        onSubmit={value => this.updateCase(value)}
        isRequesting={isRequesting}
        inputParams={listFields}
        rules={rules}
        form={form}
        resetState={this.resetState}
        labelButton={translate("update").toUpperCase()}
        title={translate("updateCase")}
        extraButtons={extraButtons}
        componentName="update-case"
        updateForm={updateForm}
        timeZone={baseTimeZone}
      />
    );
  };
}
