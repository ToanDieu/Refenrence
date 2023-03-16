import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import ss from "classnames";
import { Button } from "element-react";
import c from "./params-form.comp.scss";
import { isContainScope } from "@/actions/utils";
import { ParamField } from "@/components/params-form/ParamField";
import AddFieldButton from "@/components/AddFieldButton";
import RemoveParamVerify from "./remove-param-verify/container";
import Tooltip from "@/components/tooltip";

export default class ParamForm extends Component {
  render() {
    const {
      params,
      onDragEnd,
      onAdd,
      onSubmit,
      disabled,
      quantity,
      baseID,
      paramID,
      fetBaseParams,
      translate
    } = this.props;
    params.sort((a, b) => a.orderNum - b.orderNum);
    const buttonDisabled = disabled ? "button-disbaled" : "";
    return (
      <div className={ss(c.wrapper)}>
        <RemoveParamVerify paramStuff={{ baseID, paramID, fetBaseParams }} />
        <div
          className={ss(
            c["container-lg-form__button-group"],
            c[buttonDisabled]
          )}
        >
          <Button
            onClick={onSubmit}
            disabled={disabled}
            style={{
              color: "#ffffff"
            }}
          >
            {translate("submit")}
          </Button>
        </div>
        <div className={ss(c["quantity-left"])}>
          <span>
            {quantity}
            /20
          </span>
        </div>

        {params.length > 0 && (
          <div className={ss(c.title)}>
            <div className={ss(c.title__name)}>
              {translate("key")}
              <Tooltip content={translate("paramNameTooltip")} />
            </div>
            <div className={ss(c.title__label)}>
              {translate("displayName")}
              <Tooltip content={translate("paramDisplayNameTooltip")} />
            </div>
            <div className={ss(c.title__description)}>
              {translate("description")}
              <Tooltip content={translate("paramDescriptionTooltip")} />
            </div>
            <div className={ss(c.title__type)}>
              {translate("type")}
              <Tooltip content={translate("paramTypeTooltip")} />
            </div>
            <div className={ss(c.title__checkbox)}>
              {translate("required")}
              <Tooltip content={translate("paramRequireTooltip")} />
            </div>
            <div className={ss(c.title__checkbox)}>
              {translate("hidden")}
              <Tooltip content={translate("paramVisibleTooltip")} />
            </div>
          </div>
        )}
        <DragDropContext onDragEnd={result => onDragEnd(result)}>
          <Droppable droppableId="droppable">
            {provided => (
              <div ref={provided.innerRef}>
                {params.map((item, index) => {
                  return (
                    <Draggable
                      isDragDisabled={!isContainScope("put:my-org-type:base")}
                      key={`${item.ID}`}
                      draggableId={`${item.ID}`}
                      index={index}
                    >
                      {received => (
                        <div
                          ref={received.innerRef}
                          {...received.draggableProps}
                          {...received.dragHandleProps}
                        >
                          <ParamField
                            onClose={() => item.onClose()}
                            assets={item}
                            translate={translate}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {isContainScope("put:my-org-type:base") ? (
                  <div className="u-margin-left--5">
                    <AddFieldButton
                      disabled={quantity >= 20}
                      onAdd={() => onAdd()}
                      text="addParam"
                    />
                  </div>
                ) : null}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}

ParamForm.defaultProps = {
  params: [],
  onDragEnd: () => {},
  onAdd: () => {},
  onSubmit: () => {},
  disabled: true,
  quantity: 0,
  paramID: undefined,
  fetBaseParams: () => {},
  translate: () => {}
};

ParamForm.propTypes = {
  params: PropTypes.shape([]),
  onDragEnd: PropTypes.func,
  onAdd: PropTypes.func,
  onSubmit: PropTypes.func,
  disabled: PropTypes.bool,
  quantity: PropTypes.number,
  paramID: PropTypes.number,
  baseID: PropTypes.oneOfType(PropTypes.string, PropTypes.number).isRequired,
  fetBaseParams: PropTypes.func,
  translate: PropTypes.func
};
