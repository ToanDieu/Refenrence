/* eslint-disable react/no-multi-comp */
import React, { Component } from "react";
import PropTypes from "prop-types";

import { assocPath, pathOr } from "ramda";

import { Form, Input, Button } from "element-react";

import ss from "classnames";
import c from "./update-case.comp.scss";

import Modal from "@/components/modal/container";
import orgConfigs from "@/constants/orgConfigs";
import {
  phonePatternStandard,
  phonePatternWithDomainCode,
  phonePatternWithVnDomain
} from "@/constants/index";
import icWarning from "./icons/ic-warning.svg";

export const componentName = "update-case";

export const propTypes = {
  caseId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  orgName: PropTypes.string,
  isRequesting: PropTypes.bool,
  // data
  defaultValues: PropTypes.shape({
    caseId: PropTypes.string,
    issuer: PropTypes.string,
    mobile: PropTypes.string
  }),
  // actions
  onSubmit: PropTypes.func,
  // helper
  translate: PropTypes.func
};
// error holder
const ErrorHolder = ({ mess }) => (
  <p className={ss(c["error-holder"])}>{mess}</p>
);

ErrorHolder.propTypes = {
  mess: PropTypes.string
};

export default class UpdateCase extends Component {
  static propTypes = propTypes;

  static defaultProps = {
    isRequesting: false,
    orgName: undefined,
    defaultValues: {
      caseId: "",
      issuer: "",
      mobile: ""
    },
    translate: langKey =>
      console.log(`not embbed an i18n management to solve ${langKey}`)
  };

  constructor(props) {
    super(props);
  }

  state = {
    form: { caseId: "", issuer: "", mobile: "" },
    errorMess: { caseId: "", issuer: "", mobile: "", extraParams: "" },
    fieldName: [""]
  };

  componentWillMount() {
    this.initValues();
  }

  componentDidUpdate(oldProps) {
    if (this.props.defaultValues != oldProps.defaultValues) {
      this.initValues();
    }
  }

  initValues = () => {
    this.setState(state =>
      assocPath(["form"], this.props.defaultValues, state)
    );
  };

  valueChange = keyPath => val => {
    const { translate } = this.props;
    this.setState({ fieldName: keyPath });
    if (keyPath[0] === "caseId") {
      if (!val) {
        this.setState(state =>
          assocPath(["errorMess", "caseId"], translate("required"), state)
        );
      } else if (val.trim().replace(" ", "").length === 0) {
        this.setState(state =>
          assocPath(["errorMess", "caseId"], translate("required"), state)
        );
      } else {
        this.setState(state => assocPath(["errorMess", "caseId"], "", state));
      }
    } else if (keyPath[0] === "issuer") {
      if (!val) {
        this.setState(state =>
          assocPath(["errorMess", "issuer"], translate("required"), state)
        );
      } else if (val.trim().replace(" ", "").length === 0) {
        this.setState(state =>
          assocPath(["errorMess", "issuer"], translate("required"), state)
        );
      } else {
        this.setState(state => assocPath(["errorMess", "issuer"], "", state));
      }
    } else if (keyPath[0] === "mobile") {
      if (!val) {
        this.setState(state =>
          assocPath(["errorMess", "mobile"], translate("required"), state)
        );
      } else if (val.trim().replace(" ", "").length === 0) {
        this.setState(state =>
          assocPath(["errorMess", "mobile"], translate("required"), state)
        );
      } else if (val.includes(" ")) {
        this.setState(state =>
          assocPath(["errorMess", "mobile"], translate("nowhitespace"), state)
        );
      } else if (
        !phonePatternStandard.test(val) &&
        !phonePatternWithDomainCode.test(val) &&
        !phonePatternWithVnDomain.test(val)
      ) {
        this.setState(state =>
          assocPath(
            ["errorMess", "mobile"],
            translate("invalidphonenumber"),
            state
          )
        );
      } else {
        this.setState(state => assocPath(["errorMess", "mobile"], "", state));
      }
    } else if (!val) {
      this.setState(state =>
        assocPath(["errorMess", "extraParams"], translate("required"), state)
      );
    } else if (val.trim().replace(" ", "").length === 0) {
      this.setState(state =>
        assocPath(["errorMess", "extraParams"], translate("required"), state)
      );
    } else {
      this.setState(state =>
        assocPath(["errorMess", "extraParams"], "", state)
      );
    }
    this.setState(state => assocPath(["form", ...keyPath], val, state));
  };

  // extraPaths return empty slice if not provied orgName
  extraPaths = () => {
    const { orgName } = this.props;
    const extraPaths = pathOr(
      [],
      [orgName, "display", "caseDetailPage", "updateCase", "extraPaths"],
      orgConfigs
    );

    return extraPaths;
  };

  submitForm = () => this.props.onSubmit(this.state.form);

  render = () => {
    const { isRequesting, defaultValues, translate } = this.props;
    const { form, errorMess } = this.state;
    return (
      <Modal
        ref="modal"
        title={translate("updateCase")}
        componentName={componentName}
        loading={isRequesting}
        ftClassName={ss(c.footer)}
        footer={
                    <div className={ss(c["button-group"])}>
  <img src={icWarning} />
  <p>{translate("editcasewarning")}</p>
  <Button
              className={ss(c["send-button"])}
              disabled={
                form == defaultValues ||
                errorMess.caseId ||
                errorMess.issuer ||
                errorMess.mobile ||
                errorMess.extraParams
              }
              onClick={this.submitForm}
              type="primary"
            >
              {translate("send")}
            </Button>
</div>
        }
        onOffForm={() => this.initValues()}
      >
        <Form ref="form" labelPosition="top" labelWidth="100" model={form}>
          {/* common fields for any org */}
          <Form.Item label={translate("caseid")} prop="caseId">
            <Input
              value={form.caseId}
              onChange={this.valueChange(["caseId"])}
            />
            {errorMess.caseId ? <ErrorHolder mess={errorMess.caseId} /> : null}
          </Form.Item>
          <Form.Item label={translate("issuer")} prop="issuer">
            <Input
              value={form.issuer}
              onChange={this.valueChange(["issuer"])}
            />
            {errorMess.issuer ? <ErrorHolder mess={errorMess.issuer} /> : null}
          </Form.Item>
          <Form.Item label={translate("mobilenumber")} prop="mobile">
            <Input
              value={form.mobile}
              onChange={this.valueChange(["mobile"])}
              placeholder={translate("inputplaceholder")}
            />
            {errorMess.mobile ? <ErrorHolder mess={errorMess.mobile} /> : null}
          </Form.Item>

          {/* extraFields to display custom field for configed org */
          this.extraPaths().map((path, index) => (
            <Form.Item
              key={index}
              label={translate("LicensePlate")}
              prop="mobile"
            >
              <Input
                value={pathOr("", path.value, form)}
                onChange={this.valueChange(path.value)}
              />
              {errorMess.extraParams ? (
                <ErrorHolder mess={errorMess.extraParams} />
              ) : null}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    );
  };
}
