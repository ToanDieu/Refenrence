/* eslint-disable react/no-multi-comp */
import React, { Component } from "react";
import PropTypes from "prop-types";

import { assocPath, pathOr } from "ramda";

import ss from "classnames";
import c from "./create-case.comp.scss";

import { Form, Input, Button, Checkbox } from "element-react";
import format from "date-fns/format";
import moment from "moment-timezone";

import { timeRegex } from "@/constants/index";
import Modal from "@/components/modal/container";
import DatePickerCustom from "@/components/date-picker/DatePickerCustom";
import InputTime from "@/components/presents/NodeDetail/ActionDelay/Input";
import DropDown from "@/components/units/Dropdown";

export const componentName = "case-create";

// error holder
const Tooltip = info => (info ? <Tooltip content={<div>{info}</div>} /> : "");
const ErrorHolder = ({ mess } = { mess }) => (
  <p className={ss(c["error-holder"])}>{mess}</p>
);

ErrorHolder.propTypes = {
  mess: PropTypes.string
};

ErrorHolder.defaultProps = {
  mess: ""
};

export const propTypes = {
  isRequesting: PropTypes.bool,
  onSubmit: PropTypes.func,
  baseID: PropTypes.number
};

export default class CreateCase extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.modalRef = React.createRef();
  }

  state = {
    form: {},
    rules: {},
    inputParams: [],
    updateForm: false,
    disabled: true
  };

  componentWillReceiveProps = nextProps => {
    const { updateForm } = this.state;
    if (this.state.updateForm !== nextProps.updateForm) {
      this.setState({
        form: nextProps.form,
        rules: nextProps.rules,
        inputParams: nextProps.inputParams,
        updateForm: !updateForm
      });
    }
  };

  closeModal = () => {
    this.resetState();
    this.modalRef.current.offForm();
  };

  resetState = () => {
    const { form } = this.state;

    const { form: newForm, params: newParams, rules: newRules } = this.props
      .resetState
      ? this.props.resetState(form)
      : { form, newRules: {}, newParams: {} };
    this.setState({
      form: newForm,
      rules: newRules,
      inputParams: newParams,
      disabled: true
    });
  };

  submitForm = () => {
    this.formRef.current.validate(valid => {
      if (valid) {
        this.props.onSubmit({
          values: this.state.form,
          closeModal: this.closeModal
        });

        this.resetState();
        return true;
      }
      return false;
    });
  };

  onChange = key => value => {
    this.setState(
      state => assocPath(["form", key], value, state),
      () => {
        this.formRef.current.validate(valid => {
          this.setState({
            disabled: !valid
          });
        });
      }
    );
  };

  onChangeDate = key => value => {
    let stringDate = "";
    if (value) {
      stringDate = format(value, "YYYY-MM-DD HH:mm");
    }

    this.onChange(key)(`${stringDate}`);
  };

  getTimezoneOffset = timeZone => {
    if (timeZone) {
      return moment(new Date())
        .tz(timeZone)
        .format("Z");
    }
    return "+00:00";
  };

  paramParser = (param, index, form, timeZone) => {
    if (!pathOr(false, ["visible"], param)) {
      return "";
    }

    switch (param.type) {
      case "checkbox":
        return (
          <Form.Item key={index} prop="test">
            <Checkbox
              checked={pathOr(false, [param.name], form)}
              onChange={this.onChange(param.name)}
            >
              {param.label}
              {Tooltip(pathOr(false, ["description"], param))}
            </Checkbox>
          </Form.Item>
        );
      case "date": {
        let inputDate = pathOr("", [param.name], form);
        if (inputDate) {
          inputDate = new Date(inputDate);
        }
        return (
          <Form.Item key={index} label={param.label} prop={param.name}>
            <DatePickerCustom
              value={inputDate}
              handleOnchange={this.onChangeDate(param.name)}
              styles="original"
              isShowTime
              format="dd/MM/yyyy HH:mm"
              disabledDate={() => {}}
            />
            <span className={ss(c.timezone)}>
              (UTC
              {this.getTimezoneOffset(timeZone)}
              <span>)</span>
              {timeZone}
            </span>
          </Form.Item>
        );
      }
      case "duration": {
        return (
          <Form.Item key={index} label={param.label} prop={param.name}>
            <div className={ss(c["input-time"])}>
              <InputTime
                value={pathOr("", [param.name], form)}
                onChange={this.onChange(param.name)}
                isValid={timeRegex.test(pathOr("", [param.name], form))}
              />
            </div>
          </Form.Item>
        );
      }
      case "boolean": {
        const items = [
          {
            id: "true",
            name: "True"
          },
          {
            id: "false",
            name: "False"
          }
        ];
        const preHandler = item => {
          this.onChange(param.name)(item.id);
        };
        return (
          <Form.Item key={index} label={param.label} prop={param.name}>
            <DropDown
              initial={pathOr("false", [param.name], form)}
              items={items}
              onChange={item => preHandler(item)}
              className={ss(c["boolean-dropdown"])}
            />
          </Form.Item>
        );
      }
      default:
        return (
          <Form.Item key={index} label={param.label} prop={param.name}>
            <Input
              id={param.name}
              value={pathOr("", [param.name], form)}
              onChange={this.onChange(param.name)}
            />
          </Form.Item>
        );
    }
  };

  submitHolder = ({ labelButton, disabled }) => {
    return (
      <Button onClick={this.submitForm} type="primary" disabled={disabled}>
        {labelButton}
      </Button>
    );
  };

  render = () => {
    const {
      isRequesting,
      labelButton,
      extraButtons,
      title,
      timeZone
    } = this.props;
    const { form, disabled, rules, inputParams } = this.state;
    const footer = (
      <div className={ss(c["button-group"])}>
        {extraButtons.map(extraButton => extraButton)}
        {this.submitHolder({ labelButton, disabled })}
      </div>
    );
    return (
      <div className={ss(c["create-case-form"])}>
        <Modal
          ref={this.modalRef}
          title={title}
          componentName={
            this.props.componentName ? this.props.componentName : componentName
          }
          loading={isRequesting}
          footer={footer}
          onOffForm={this.resetState}
        >
          <Form
            ref={this.formRef}
            labelPosition="top"
            labelWidth="100"
            model={form}
            rules={rules}
          >
            {/* extraFields get from backend */}
            {inputParams.map((param, index) =>
              this.paramParser(param, index, form, timeZone)
            )}
          </Form>
        </Modal>
      </div>
    );
  };
}

CreateCase.propTypes = {
  isRequesting: PropTypes.bool,
  onSubmit: PropTypes.func,
  inputParams: PropTypes.array,
  rules: PropTypes.object,
  form: PropTypes.object,
  resetState: PropTypes.func,
  labelButton: PropTypes.string,
  extraButtons: PropTypes.array,
  title: PropTypes.string,
  componentName: PropTypes.string,
  updateForm: PropTypes.bool,
  timeZone: PropTypes.string
};

CreateCase.defaultProps = {
  isRequesting: false,
  extraButtons: [],
  onSubmit: () => {},
  inputParams: [],
  rules: {},
  form: {},
  resetState: () => {},
  labelButton: "",
  title: "",
  componentName: "",
  updateForm: false,
  timeZone: ""
};
