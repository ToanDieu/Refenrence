/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/no-danger */
import React from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";
import fieldFormat from "../constants/passFieldFormat.js";
import { pathOr } from "ramda";

class PassFieldGroup extends React.Component {
  state = {
    fields: [],
    dataType: "",
    lang: "",
    classUnkown: {}
  };
  componentDidMount() {
    const { fields, dataType, lang, classUnkown } = this.props;
    this.setState({
      fields: fields || [],
      dataType: dataType || "",
      lang: lang || "",
      classUnkown: classUnkown || {}
    });
  }
  componentWillReceiveProps(props) {
    const { fields, dataType, lang, classUnkown } = props;
    this.setState({
      fields: fields || [],
      dataType: dataType || "",
      lang: lang || "",
      classUnkown: classUnkown || {}
    });
  }

  render() {
    let width = "100%";
    const { fields, dataType, lang, classUnkown } = this.state;
    console.log("======>", fields, dataType, lang, classUnkown);
    if (fields) {
      width = Math.floor(100 / fields.length) + "%";
    }

    const { tooltipHelper } = this.props;

    const listHeader = fields
      .slice()
      .reverse()
      .map(field => (
        <div
          key={field.key.toString() + "10"}
          className="row field-group"
          // data-ng-repeat="field in $ctrl.fields.slice().reverse() track by $index"
          // data-ng-style="{width: $ctrl.width}"
          style={{ width: width }}
        >
          <PassField field={field} dataType={dataType} lang={lang} />
        </div>
      ));
    const listFields = fields.map(field => (
      <div
        key={field.key.toString()}
        className="row field-group"
        // data-ng-repeat="field in $ctrl.fields track by $index"
        // data-ng-style="{width: $ctrl.width}"
        style={{ width: width }}
      >
        <PassField field={field} dataType={dataType} lang={lang} />
      </div>
    ));
    return (
      <div>
        {dataType == "header" ? listHeader : listFields}
        {/* <div className="pass-reivew--tooltip"> */}
        {tooltipHelper && fields && fields.length > 0 ? tooltipHelper() : null}
        {/* </div> */}
      </div>
    );
  }
}

PassFieldGroup.propTypes = {
  fields: PropTypes.array,
  dataType: PropTypes.object,
  lang: PropTypes.object,
  classUnkown: PropTypes.object,
  tooltipHelper: PropTypes.func
};

class PassField extends React.Component {
  state = {
    field: {},
    lang: "",
    dataType: "",
    textAlign: {}
  };
  componentDidMount() {
    let { field, lang, dataType } = this.props;
    field = this.preProcess(field);
    this.setState({
      field: field || {},
      dataType: dataType,
      lang: lang || ""
    });
  }
  componentWillReceiveProps(props) {
    let { field, lang } = props;
    field = this.preProcess(field);
    this.setState({
      field: field || {},
      lang: lang || ""
    });
  }
  preProcess = val => {
    if (val && val.value) {
      if (val.textAlignment) {
        this.setState({
          textAlign: fieldFormat.TextAlignmentMap[val.textAlignment]
        });
      }
      if (val.dateStyle) {
        /*
              `json:"dateStyle,omitempty"`
              `json:"ignoresTimeZone,omitempty"`
              `json:"isRelative,omitempty"`
              `json:"timeStyle,omitempty"`
          */
        val.value = this.timeFormatValue(
          val.value,
          fieldFormat.DateStyleMap[val.dateStyle]
        );
      }
      if (val.currencyCode) {
        if (fieldFormat.CurrencyMap[val.currencyCode]) {
          val.value = fieldFormat.CurrencyMap[val.currencyCode] + val.value;
        } else {
          val.value = val.currencyCode + val.value;
        }
      }
      if (val.numberStyle) {
        val.value = this.numberFormat(
          val.value,
          fieldFormat.NumberStyleMap[val.numberStyle]
        );
      }
    }
    return val;
  };
  timeFormatValue = (date, style) => {
    let formatDate;
    switch (style) {
      case "full": // Wednesday, July 17, 2019
        formatDate = "dddd, MMMM D, YYYY";
        break;
      case "long": // July 17, 2019
        formatDate = "MMMM D, YYYY";
        break;
      case "medium": // Jul 17, 2019
        formatDate = "MMM D, YYYY";
        break;
      case "short": // 7/17/19 (short)
        formatDate = "M/D/YY";
        break;
      default:
        return date;
    }
    return format(date, formatDate);
  };

  //New feature
  numberFormat = (value, formatNumber) => {
    let nums = String(value).match(/\d+/);
    if (pathOr(false, [length], nums)) {
      return value;
    }
    switch (formatNumber) {
      case "percent":
        return nums.map(number =>
          String(value).replace(String(number), number + "%")
        );
      default:
        return value;
    }
  };
  getValue = field => {
    let text = "";
    text = pathOr("", ["attributedValue"], field);
    text = pathOr(text, ["value"], field);
    console.log("getValue__text: ", text);
    return text.replace(/\n/g, "<br>");
  };

  render() {
    let { field, lang, dataType } = this.state;
    const { tooltipHelper } = this.props;

    //uppercase label font field
    if (dataType == "primary" || dataType == "extra" || dataType == "header") {
      field.label = field.label.toUpperCase();
    }
    console.log("PassField:", field, lang);
    //field = this.preProcess(field);
    return (
      <div
        className="field"
        style={{ textAlign: this.state.textAlign, marginBottom: "0" }}
      >
        <div className="field-wrapper">
          <label className="pass-label">{field.label}</label>
          <span className="pass-value">
            <div
              style={{ display: "inline" }}
              dangerouslySetInnerHTML={{ __html: this.getValue(field) }}
            />
            {tooltipHelper ? tooltipHelper() : null}
          </span>
        </div>
      </div>
    );
  }
}

PassField.propTypes = {
  field: PropTypes.object,
  lang: PropTypes.string,
  dataType: PropTypes.string,
  textAlign: PropTypes.string,
  tooltipHelper: PropTypes.func
};
export { PassFieldGroup, PassField };
