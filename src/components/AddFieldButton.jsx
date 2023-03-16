import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTranslate, getActiveLanguage } from "react-localize-redux";

import addIcon from "../assets/icons/ic-circle-add-active.svg";

const AddFieldButton = props => {
  const { fieldType, align, translate, activeLanguage, text, disabled } = props;

  let justifyContent = "";
  if (align === "right") {
    justifyContent = "flex-end";
  }

  const textHolder = () => {
    if (fieldType) {
      if (activeLanguage.code === "de") {
        return (
          <span>
            <span className="capitalizes__first-letter">{fieldType}</span>
            &nbsp;
            {translate("field")}
            {translate("add")}
          </span>
        );
      }
      return (
        <span>
          {translate("add")}
          &nbsp;
          <span className="capitalizes__first-letter">{fieldType}</span>
          &nbsp;
          {translate("field")}
        </span>
      );
    }

    return translate(text || "addField");
  };

  return (
    <div
      className="field"
      style={
        disabled
          ? {
              display: "flex",
              justifyContent,
              alignItems: "center",
              cursor: "not-allowed",
              marginTop: "20px",
              opacity: 0.5,
              width: "fit-content"
            }
          : {
              display: "flex",
              justifyContent,
              alignItems: "center",
              cursor: "pointer",
              marginTop: "20px",
              width: "fit-content"
            }
      }
      onClick={disabled ? null : props.onAdd}
    >
      <img alt="add icon" src={addIcon} />
      &nbsp;
      <span style={{ color: "#f08262", marginLeft: "6px" }}>
        {textHolder()}
      </span>
    </div>
  );
};

AddFieldButton.propTypes = {
  fieldType: PropTypes.string,
  onAdd: PropTypes.func,
  align: PropTypes.string,
  translate: PropTypes.func,
  activeLanguage: PropTypes.object,
  text: PropTypes.string,
  disabled: PropTypes.bool
};

AddFieldButton.defaultProps = {
  fieldType: "",
  onAdd: () => {},
  align: "right",
  translate: () => {},
  activeLanguage: "en",
  text: "addField",
  disabled: false
};

export default connect(
  state => ({
    translate: getTranslate(state.locale),
    activeLanguage: getActiveLanguage(state.locale)
  }),
  () => ({})
)(AddFieldButton);
