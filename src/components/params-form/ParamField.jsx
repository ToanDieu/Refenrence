import React from "react";
import PropTypes from "prop-types";
import ss from "classnames";
import { debounce } from "lodash/fp";
import { pathOr } from "ramda";
import c from "./param-field.comp.scss";

import closeIcon from "@/assets/icons/ic-circle-close.svg";

import { InputField } from "@/components/params-form/InputField";
import { SelectOption } from "@/components/params-form/SelectOption";
import { CheckBoxBasic } from "@/components/params-form/CheckBoxBasic";
import { ErrorHolder } from "@/components/params-form/Error";

export class ParamField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: pathOr("", ["assets", "name", "value"], this.props),
      label: pathOr("", ["assets", "label", "value"], this.props),
      description: pathOr("", ["assets", "description", "value"], this.props),
      type: pathOr("", ["assets", "type", "value"], this.props)
    };

    this.onChangeWithDebounce = debounce(500, (identifier, val) => {
      const { assets } = this.props;
      assets[identifier].onChange({
        value: val,
        orderNum: assets.orderNum,
        type: identifier,
        id: assets.ID
      });
    });
  }

  onChangeVal = identifier => val => {
    this.setState({ [identifier]: val }, () => {
      this.onChangeWithDebounce(identifier, val);
    });
  };

  render() {
    const { name, label, description, type } = this.state;
    const { onClose, translate, assets } = this.props;
    return (
      <div className={ss(c.wrapper)}>
        <div className={ss(c.items)}>
          <div className={ss(c.item, c.items__input, c["width-item--15"])}>
            <InputField
              disabled={assets.isSystem}
              label={assets.name.label}
              tooltip={assets.name.tooltip}
              value={name}
              onChange={this.onChangeVal("name")}
            />
            {assets.name.isModified && !assets.name.errorMess && (
              <span className={ss(c["modified-notify"])}>
                {translate("modified")}
              </span>
            )}
            <ErrorHolder mess={assets.name.errorMess} />
          </div>
          <div className={ss(c.item, c.items__input, c["width-item--20"])}>
            <InputField
              disabled={assets.isSystem}
              label={assets.label.label}
              tooltip={assets.label.tooltip}
              value={label}
              onChange={this.onChangeVal("label")}
            />
            {assets.label.isModified && !assets.label.errorMess && (
              <span className={ss(c["modified-notify"])}>
                {translate("modified")}
              </span>
            )}
            <ErrorHolder mess={assets.label.errorMess} />
          </div>
          <div className={ss(c.item, c.items__textarea, c["width-item--30"])}>
            <InputField
              disabled={assets.isSystem}
              label={assets.description.label}
              tooltip={assets.description.tooltip}
              value={description}
              onChange={this.onChangeVal("description")}
            />
            {assets.description.isModified && (
              <span className={ss(c["modified-notify"])}>
                {translate("modified")}
              </span>
            )}
            <ErrorHolder mess={assets.description.errorMess} />
          </div>
          <div className={ss(c.item, c.items__select, c["width-item--10"])}>
            <SelectOption
              label={assets.type.label}
              tooltip={assets.type.tooltip}
              options={assets.type.options}
              value={type}
              onChange={this.onChangeVal("type")}
              disabled={assets.type.disabled}
            />
            {assets.type.isModified && (
              <span className={ss(c["modified-notify"])}>
                {translate("modified")}
              </span>
            )}
            <ErrorHolder mess={assets.type.errorMess} />
          </div>

          <div className={ss(c.item, c.items__checkbox, c["width-item--12-5"])}>
            <CheckBoxBasic
              label={assets.isRequired.label}
              isChecked={assets.isRequired.isChecked}
              onClick={
                !assets.isSystem
                  ? () => assets.isRequired.onClick(assets.orderNum)
                  : undefined
              }
              disabled={assets.isSystem}
            />
            {assets.isRequired.isModified && (
              <span className={ss(c["modified-notify"])}>
                {translate("modified")}
              </span>
            )}
          </div>
          <div className={ss(c.item, c.items__checkbox, c["width-item--12-5"])}>
            <CheckBoxBasic
              label={assets.visible.label}
              isChecked={assets.visible.isChecked}
              onClick={
                !assets.isSystem
                  ? () => assets.visible.onClick(assets.orderNum)
                  : undefined
              }
              disabled={assets.isSystem}
            />
            {assets.visible.isModified && (
              <span className={ss(c["modified-notify"])}>
                {translate("modified")}
              </span>
            )}
          </div>
        </div>
        <img
          alt="icon"
          className={ss(c.img)}
          src={closeIcon}
          onClick={!assets.isSystem ? onClose : undefined}
        />
      </div>
    );
  }
}

ParamField.defaultProps = {
  onClose: () => {},
  translate: () => {}
};

ParamField.propTypes = {
  onClose: PropTypes.func,
  assets: PropTypes.object.isRequired,
  translate: PropTypes.func
};
