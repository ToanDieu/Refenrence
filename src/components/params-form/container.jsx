import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getTranslate } from "react-localize-redux";
import { pathOr } from "ramda";
// import { findIndex } from "lodash";
import {
  fetchBaseParamsWithoutStore,
  updateBaseParamsWithoutStore,
  updateSingleBaseParamWithoutStore,
  createSingleBaseParamWithoutStore
} from "@/actions/base";
import ParamForm from "@/components/params-form/index";
import { showForm } from "@/ducks/forms";
import { componentName as RemoveParamVerifyName } from "./remove-param-verify";

class ParamFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: [],
      onAdd: () => this.onAdd(),
      onDragEnd: result => this.onDragEnd(result),
      disabled: true,
      quantity: 0,
      paramID: undefined
    };
  }

  componentDidMount() {
    const { turnLangSwitch, turnPassReviewSwitch } = this.props;
    turnLangSwitch(false);
    turnPassReviewSwitch(false);
    this.fetchBaseParams();
  }

  componentWillUnmount() {
    const { turnLangSwitch, turnPassReviewSwitch } = this.props;
    turnLangSwitch(true);
    turnPassReviewSwitch(true);
    this.fetchBaseParams();
  }

  onAdd = () => {
    const { params } = this.state;
    const { translate } = this.props;
    const maxOderNum =
      params.length !== 0
        ? params.reduce(
            (max, p) => Math.max(max, p.orderNum),
            params[0].orderNum
          )
        : 0;
    const id = Math.random() + params.length;
    const value = {
      ID: id,
      name: {
        value: "",
        errorMess: "",
        onChange: val => this.onChange(val),
        isModified: false
      },
      label: {
        value: "",
        errorMess: "",
        onChange: val => this.onChange(val),
        isModified: false
      },
      type: {
        value: "text",
        errorMess: "",
        options: [
          {
            value: "text",
            label: translate("text")
          },
          {
            value: "email",
            label: translate("email")
          },
          {
            value: "mobileNumber",
            label: translate("mobilenumber")
          },
          {
            value: "date",
            label: translate("date")
          },
          {
            value: "number",
            label: translate("number")
          },
          {
            value: "duration",
            label: translate("durationLabel")
          },
          {
            value: "boolean",
            label: translate("boolean")
          }
        ],
        onChange: val => this.onChange(val),
        disabled: false,
        isModified: false
      },
      description: {
        value: "",
        errorMess: "",
        onChange: val => this.onChange(val),
        isModified: false
      },
      isRequired: {
        isChecked: false,
        onClick: orderNum => this.checkboxClick("isRequired", orderNum),
        isModified: false
      },
      visible: {
        isChecked: false,
        onClick: orderNum => this.checkboxClick("visible", orderNum),
        isModified: false
      },
      orderNum: maxOderNum + 1,
      isValid: false,
      isModified: false,
      isNew: true,
      onClose: () => this.onClose(id)
    };
    params.push(value);
    this.setState({
      disabled: true,
      quantity: params.length
    });
  };

  onDragEnd = result => {
    const { params } = this.state;
    const [removed] = params.splice(result.source.index, 1);
    params.splice(result.destination.index, 0, removed);
    params.forEach((param, index) => {
      if (param.orderNum !== index + 1) {
        params[index] = { ...param, orderNum: index + 1, isModified: true };
      }
    });
    this.setState(
      {
        params
      },
      () => this.isDisabled()
    );
  };

  fetchBaseParams = () => {
    const { baseID, translate, fetchBaseParams } = this.props;
    const paramState = [];
    const originParams = [];
    fetchBaseParams({ baseID }).then(data => {
      data.forEach(item => {
        const value = {
          ID: item.ID,
          name: {
            value: item.name,
            errorMess: "",
            onChange: val => this.onChange(val),
            isModified: false
          },
          label: {
            value: item.label,
            errorMess: "",
            onChange: val => this.onChange(val),
            isModified: false
          },
          type: {
            value: item.type,
            errorMess: "",
            options: [
              {
                value: "text",
                label: translate("text")
              },
              {
                value: "email",
                label: translate("email")
              },
              {
                value: "mobileNumber",
                label: translate("mobilenumber")
              },
              {
                value: "date",
                label: translate("date")
              },
              {
                value: "number",
                label: translate("number")
              },
              {
                value: "duration",
                label: translate("durationLabel")
              },
              {
                value: "boolean",
                label: translate("boolean")
              }
            ],
            onChange: val => this.onChange(val),
            disabled: true,
            isModified: false
          },
          description: {
            value: item.description,
            errorMess: "",
            onChange: val => this.onChange(val),
            isModified: false
          },
          isRequired: {
            isChecked: item.required,
            onClick: orderNum => this.checkboxClick("isRequired", orderNum),
            isModified: false
          },
          isSystem: item.system || false,
          visible: {
            isChecked: !pathOr(false, ["visible"], item),
            onClick: orderNum => this.checkboxClick("visible", orderNum),
            isModified: false
          },
          orderNum: item.orderNum,
          isValid: true,
          isModified: false,
          isNew: false,
          onClose: () => this.onClose(item.ID)
        };
        paramState.push(value);
        originParams.push({
          ID: item.ID,
          name: item.name,
          orderNum: item.orderNum,
          visible: pathOr(false, ["visible"], item)
        });
      });
      this.setState({
        params: paramState,
        quantity: paramState.length,
        disabled: true
      });
    });
  };

  onSubmit = () => {
    const {
      baseID,
      createSingleParam,
      updateSingleParam,
      updateBaseParams
    } = this.props;
    const { params } = this.state;
    const paramsModified = params.filter(param => param.isModified);
    const edits = [];
    this.setState({
      disabled: true
    });
    paramsModified.forEach(param => {
      const payload = {
        baseID: parseInt(baseID, 10),
        label: param.label.value,
        description: param.description.value,
        name: param.name.value,
        orderNum: param.orderNum,
        required: param.isRequired.isChecked,
        visible: !param.visible.isChecked,
        type: param.type.value
      };
      if (!param.isNew) {
        // EDIT
        edits.push(param);
      } else {
        // INSERT
        createSingleParam({ baseID, payload }).then(() =>
          this.fetchBaseParams()
        );
      }
    });
    if (edits.length !== 0) {
      if (edits.length === 1) {
        updateSingleParam({
          baseID,
          paramID: edits[0].ID,
          payload: {
            ID: edits[0].ID,
            baseID: parseInt(baseID, 10),
            label: edits[0].label.value,
            description: edits[0].description.value,
            name: edits[0].name.value,
            orderNum: edits[0].orderNum,
            required: edits[0].isRequired.isChecked,
            system: edits[0].isSystem,
            visible: !edits[0].visible.isChecked,
            type: edits[0].type.value
          }
        }).then(() => this.fetchBaseParams());
      } else {
        const payloads = [];
        edits.forEach(param => {
          const value = {
            ID: param.ID,
            baseID: parseInt(baseID, 10),
            label: param.label.value,
            description: param.description.value,
            name: param.name.value,
            orderNum: param.orderNum,
            required: param.isRequired.isChecked,
            system: param.isSystem,
            visible: !param.visible.isChecked,
            type: param.type.value
          };
          payloads.push(value);
        });
        updateBaseParams({ baseID, payload: payloads }).then(() =>
          this.fetchBaseParams()
        );
      }
    }
  };

  onClose = paramID => {
    const { params } = this.state;
    const { showFormProp } = this.props;
    const param = params.find(paramItem => paramItem.ID === paramID);
    if (!param.isNew) {
      // show modal confirm
      this.setState(
        {
          paramID
        },
        () => showFormProp(RemoveParamVerifyName)
      );
    } else {
      // REMOVE From Temporary List
      const newParams = params.filter(item => item.ID !== paramID);
      this.setState(
        {
          params: newParams,
          quantity: newParams.length
        },
        () => this.isDisabled()
      );
    }
  };

  onChange = valObject => {
    const { params } = this.state;
    const { translate } = this.props;
    if (valObject) {
      const { type } = valObject;
      this.setState(
        {
          params: params.map(param => {
            if (param.ID === valObject.id) {
              if (valObject.type === "name") {
                const duplicate = params.find(
                  itemParam => itemParam.name.value === valObject.value
                );
                if (valObject.value.replace(" ", "").length === 0) {
                  return {
                    ...param,
                    [type]: {
                      ...param[type],
                      errorMess: translate("required"),
                      value: valObject.value
                    },
                    isValid: false,
                    isModified: true
                  };
                }
                if (!/^[a-zA-Z]+$/.test(valObject.value)) {
                  return {
                    ...param,
                    [type]: {
                      ...param[type],
                      errorMess: translate("onlyCharacterAllowed"),
                      value: valObject.value
                    },
                    isValid: false,
                    isModified: true
                  };
                }
                if (duplicate) {
                  return {
                    ...param,
                    [type]: {
                      ...param[type],
                      errorMess: translate("nameExisted"),
                      value: valObject.value
                    },
                    isValid: false,
                    isModified: true
                  };
                }
                return {
                  ...param,
                  [type]: {
                    ...param[type],
                    errorMess: "",
                    isModified: true,
                    value: valObject.value
                  },
                  isValid: true,
                  isModified: true
                };
              }
              return {
                ...param,
                [type]: {
                  ...param[type],
                  value: valObject.value,
                  isModified: true
                },
                isModified: true
              };
            }
            return param;
          })
        },
        () => this.isDisabled()
      );
    }
  };

  isDisabled = () => {
    const { params } = this.state;
    let count = 0;
    const paramsModified = params.filter(
      param => !(!param.isModified && param.isValid)
    );
    paramsModified.forEach(param => {
      if (!param.isValid) {
        count = 1;
      }
    });
    if (count > 0) {
      this.setState({
        disabled: true
      });
    }
    if (paramsModified.length !== 0 && count === 0) {
      this.setState({
        disabled: false
      });
    }
  };

  checkboxClick = (field, orderNum) => {
    const { params } = this.state;
    params.forEach((param, index) => {
      if (param.orderNum === orderNum) {
        params[index] = {
          ...param,
          [field]: {
            ...param[field],
            isChecked: !param[field].isChecked,
            isModified: true
          },
          isModified: true
        };
      }
    });
    this.setState(
      {
        params
      },
      () => this.isDisabled()
    );
  };

  render() {
    const {
      params,
      onDragEnd,
      onAdd,
      disabled,
      quantity,
      paramID
    } = this.state;
    const { baseID, translate } = this.props;
    return (
      <ParamForm
        params={params}
        onDragEnd={onDragEnd}
        onAdd={onAdd}
        onSubmit={this.onSubmit}
        disabled={disabled}
        quantity={quantity}
        baseID={baseID}
        paramID={paramID}
        fetBaseParams={this.fetchBaseParams}
        translate={translate}
      />
    );
  }
}

ParamFormContainer.defaultProps = {
  turnLangSwitch: () => {},
  turnPassReviewSwitch: () => {},
  fetchBaseParams: () => {},
  updateBaseParams: () => {},
  updateSingleParam: () => {},
  createSingleParam: () => {},
  showFormProp: () => {},
  translate: () => {}
};

ParamFormContainer.propTypes = {
  turnLangSwitch: PropTypes.func,
  turnPassReviewSwitch: PropTypes.func,
  baseID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  fetchBaseParams: PropTypes.func,
  updateBaseParams: PropTypes.func,
  updateSingleParam: PropTypes.func,
  createSingleParam: PropTypes.func,
  showFormProp: PropTypes.func,
  translate: PropTypes.func
};
const mapDispatch = dispatch => {
  return {
    fetchBaseParams: bindActionCreators(fetchBaseParamsWithoutStore, dispatch),
    updateBaseParams: bindActionCreators(
      updateBaseParamsWithoutStore,
      dispatch
    ),
    updateSingleParam: bindActionCreators(
      updateSingleBaseParamWithoutStore,
      dispatch
    ),
    createSingleParam: bindActionCreators(
      createSingleBaseParamWithoutStore,
      dispatch
    ),
    showFormProp: bindActionCreators(showForm, dispatch)
  };
};
export default connect(
  state => ({
    translate: getTranslate(state.locale)
  }),
  mapDispatch
)(ParamFormContainer);
