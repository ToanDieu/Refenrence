import React, { FunctionComponent, useState, useEffect } from "react";
import { Dialog, Button } from "element-react";
import { assocPath, pathOr, compose, identity } from "ramda";
import { css } from "@emotion/core";
import moment from "moment";

import { ProtectedScopedComponent } from "@/components/HocComponent";
import { ActionMedia, TriggerType } from "@/resources/actions";
import ItemDescriber from "@/components/blocks/Card";
import ActionDelay from "./ActionDelay";
import { ActionSMS } from "./ActionSMS";
import ActionSetParam from "./ActionSetParam";
import ActionShowHideField, { ValueContent } from "./ActionShowHideField";
import ConditionForm from "./ConditionForm";
import TimePoint from "./TriggerTimePoint";
import TriggerDuration from "./TriggerDuration";
import { FieldMedia } from "@/resources/bases";

/**
 * ActionSelector internal component
 */

export const actionTypes = [
  {
    itemName: "Sleep",
    label: "Delay",
    detail: "Delay for a period of time before the next action.",
    iconName: "add",
    backgroundColor: "blue" as "green" | "blue"
  },
  {
    itemName: "Branch",
    label: "If/Else branch",
    detail:
      "Continue the automation in 2 different ways depending on the conditional.",
    iconName: "add",
    backgroundColor: "blue" as "green" | "blue"
  },
  {
    itemName: "SetParamValue",
    label: "Set parameter values",
    detail: "Change parameter values.",
    iconName: "add",
    backgroundColor: "blue" as "green" | "blue"
  },
  {
    itemName: "SendSMS",
    label: "Send SMS",
    detail: "Set message content to be sent.",
    iconName: "add",
    backgroundColor: "blue" as "green" | "blue"
  },
  {
    itemName: "ChangeFieldVisibility",
    label: "Pass field visibility",
    detail:
      "Change field visibility manually or assigned from a parameter. This parameter type must be Boolean.",
    iconName: "add",
    backgroundColor: "blue" as "green" | "blue"
  }
];

export const triggerTypes = [
  {
    itemName: "TimePoint",
    label: "At time",
    detail: "Schedule an action to run at a specific time in the future.",
    iconName: "add",
    backgroundColor: "green" as "green" | "blue"
  },
  {
    itemName: "TimeAfter",
    label: "After",
    detail: "Set a time period to trigger an action after a Date parameter.",
    iconName: "add",
    backgroundColor: "green" as "green" | "blue"
  },
  {
    itemName: "TimeBefore",
    label: "Before",
    detail: "Set a time period to trigger an action before a Date parameter.",
    iconName: "add",
    backgroundColor: "green" as "green" | "blue"
  },
  {
    itemName: "Condition",
    label: "Condition",
    detail: "Trigger an action if conditions are matched.",
    iconName: "add",
    backgroundColor: "green" as "green" | "blue"
  },
  // {
  //   itemName: "PassDownloaded",
  //   label: "Pass downloaded",
  //   detail: "Trigger an action if conditions are matched.",
  //   iconName: "add",
  //   backgroundColor: "green" as "green" | "blue"
  // },
  {
    itemName: "PassAdded",
    label: "Pass added",
    detail: "When a pass is added on a device (to the wallet app).",
    iconName: "add",
    backgroundColor: "green" as "green" | "blue"
  },
  {
    itemName: "PassDeleted",
    label: "Pass deleted",
    detail: "When a pass is deleted from a device (to the wallet app).",
    iconName: "add",
    backgroundColor: "green" as "green" | "blue"
  }
];

// Types
interface ActionSelectorPrps {
  onSelectAction: (actionType: string) => void;
}

// Component
const ActionSelector: FunctionComponent<ActionSelectorPrps> = ({
  onSelectAction
}) => {
  return (
    <div>
      {actionTypes.map((item, index: number) => {
        const indexKey = index;
        return (
          <div
            key={indexKey}
            css={css`
              padding-bottom: 8px;
              :last-of-type {
                padding-bottom: 0px;
              }
            `}
          >
            <ProtectedScopedComponent
              scopes={["post:my-org-type-base-workflow:action"]}
              manual
            >
              {({ havingScope }: { havingScope: boolean }) => (
                <ItemDescriber
                  iconName={item.iconName}
                  label={item.label}
                  detail={item.detail}
                  backgroundColor={item.backgroundColor}
                  onClick={() => {
                    if (havingScope) onSelectAction(item.itemName);
                  }}
                />
              )}
            </ProtectedScopedComponent>
          </div>
        );
      })}
    </div>
  );
};
/**
 * End ActionSelector
 */

/**
 * TriggerSelector internal component
 */

// Types
interface TriggerSelectorPrps {
  onSelectTrigger: (actionType: string) => void;
}

// Component
const TriggerSelector: FunctionComponent<TriggerSelectorPrps> = ({
  onSelectTrigger
}) => {
  return (
    <div>
      {triggerTypes.map((item, index: number) => {
        const indexKey = index;
        return (
          <div
            key={indexKey}
            css={css`
              padding-bottom: 8px;
              :last-of-type {
                padding-bottom: 0px;
              }
            `}
          >
            <ProtectedScopedComponent
              scopes={["put:my-org-type-base-workflow:action"]}
              manual
            >
              {({ havingScope }: { havingScope: boolean }) => (
                <ItemDescriber
                  iconName={item.iconName}
                  label={item.label}
                  detail={item.detail}
                  backgroundColor={item.backgroundColor}
                  onClick={() => {
                    if (havingScope) onSelectTrigger(item.itemName);
                  }}
                />
              )}
            </ProtectedScopedComponent>
          </div>
        );
      })}
    </div>
  );
};
/**
 * End TriggerSelector
 */

/**
 * NodeDetail
 */

// Types
interface paramType {
  name: string;
  type?: string;
}

interface NodeDetailPrps {
  params: paramType[];
  fields: FieldMedia[];
  parentId?: number;
  branching?: "accept" | "reject";
  visible?: boolean;
  triggerIdx?: number;
  action?: ActionMedia;
  onClose?: () => void;
  onSubmit: (action: ActionMedia | undefined, id?: number) => void;
}

// Initial data
const initActionData = {
  id: undefined,
  workflowID: 1,
  actionType: undefined,
  acceptActionID: undefined,
  rejectActionID: undefined,
  triggerQuantifier: "All",
  triggers: [],
  actionData: {}
};

// Component
const NodeDetail: FunctionComponent<NodeDetailPrps> = ({
  visible = false,
  parentId,
  triggerIdx,
  params = [],
  fields = [],
  action = initActionData, // initActionData is default schema to create new action
  branching = "accept",
  onClose = () => {},
  onSubmit = () => {}
}) => {
  // Utilities function to retrive trigger data
  const getTrigger = (trigIdx: number | undefined) =>
    trigIdx !== undefined ? pathOr(undefined, ["triggers", trigIdx]) : identity;
  const getTriggerType = (trigIdx: number | undefined) =>
    compose(
      pathOr(undefined, ["triggerType"]),
      getTrigger(trigIdx)
    );
  // These state for handling set new Action data and popup right form
  // base on trigger type and action type
  const [actData, setAct] = useState(action);
  const [valid, setValidation] = useState(false);
  const [actionType, setActionType] = useState(action.actionType);
  const [triggerType, setTriggerType] = useState(
    getTriggerType(triggerIdx)(action)
  );

  const handleSubmit = (inputActData: ActionMedia) => () => {
    onClose();
    onSubmit(
      {
        ...inputActData,
        ...(creatingAction
          ? { assignParent: { branching, id: parentId as number } }
          : {})
      },
      inputActData.id
    );
  };

  // Reflect component state with data provided
  useEffect(() => {
    setAct(action);
    setActionType(action.actionType);
    setTriggerType(getTriggerType(triggerIdx)(action));
  }, [action, triggerIdx]);

  // Condition rule shortcuts
  const creatingAction = actData.id === undefined;
  const editingAction = !creatingAction && triggerIdx === undefined;
  const editingTrigger =
    !creatingAction && triggerIdx !== undefined && triggerIdx >= 0;
  const creatingTrigger = !creatingAction && triggerIdx === -1;

  const shouldPickAction = creatingAction && !actionType;
  const shouldPickTrigger = creatingTrigger && !triggerType;
  const shouldPickType = shouldPickAction || shouldPickTrigger;

  let dialogTitle;
  let dialogFormContent;

  // This flag to controll hide/show confirm button
  let showConfirmButton = false;

  // if (creating && shouldPickType) {
  if (shouldPickType) {
    /**
     * When create new Action or Trigger user should select their type
     */

    if (shouldPickAction) {
      dialogTitle = "Select Action";
      dialogFormContent = (
        <ActionSelector
          onSelectAction={actType => setActionType(actType as any)}
        />
      );
    }
    if (shouldPickTrigger) {
      dialogTitle = "Select Trigger";
      dialogFormContent = (
        <TriggerSelector
          onSelectTrigger={trgType => setTriggerType(trgType as any)}
        />
      );
    }
  } else {
    /**
     * After picked a type then appropriated form will show
     */

    // show confirm button because it will show forms
    showConfirmButton = true;

    if (creatingAction || editingAction) {
      // Condition action
      const conditionActionVal = pathOr(
        {},
        ["actionData", "System_BranchData"],
        actData
      );

      // Delay action
      const delayActionVal = pathOr(
        undefined,
        ["actionData", "System_SleepData"],
        actData
      );

      // Set param action
      const setParamsActionVal: { [key: string]: string } = pathOr(
        "",
        ["actionData"],
        actData
      );

      // Set param SMS
      const setParamActionSMS = () => {
        if (params) {
          const paramFormatted = params.map(param => ({
            id: param.name,
            name: param.name,
            type: param.type
          }));
          return paramFormatted;
        }
        return undefined;
      };

      const setParamActionShowHideField = () => {
        const paramFormatted = setParamActionSMS();
        if (paramFormatted) {
          return paramFormatted.filter(pr => pr.type === "boolean");
        }
        return undefined;
      };

      const setActionChangeFieldVisibilityValues = () => {
        const content = pathOr(
          undefined,
          ["actionData", "System_ChangeFieldVisibility"],
          actData
        );
        const fieldFormatted: {
          [key: string]: { content?: string; extention?: string };
        } = {};
        if (content) {
          Object.keys(content).forEach(fieldId => {
            const baseContentField = fields.find(f => f.id === fieldId); // check is existing in base content
            const fieldContent = content[fieldId];
            const assignFrom = pathOr(undefined, ["assignFrom"], fieldContent);
            const hidden = pathOr(undefined, ["hidden"], fieldContent);

            if (assignFrom) {
              const assigned = {
                content: "isAssignedFrom",
                extention: assignFrom
              };
              fieldFormatted[fieldId] = assigned;
            }
            if (hidden !== undefined && hidden === true) {
              fieldFormatted[fieldId] = { content: "isHidden" };
            }
            if (hidden !== undefined && hidden === false) {
              fieldFormatted[fieldId] = { content: "isNotHidden" };
            }
            if (!baseContentField) {
              fieldFormatted[fieldId].error = true;
            }
          });
        }
        return Object.keys(fieldFormatted).length > 0
          ? fieldFormatted
          : undefined;
      };

      const setActionChangeFieldVisibilityPayload = (form: {
        [key: string]: ValueContent | undefined;
      }) => {
        const fieldFormatted: {
          [key: string]: { [key: string]: string | boolean };
        } = {};
        if (form) {
          Object.keys(form).forEach(fieldId => {
            const fieldContent = form[fieldId];
            if (fieldContent) {
              const content = pathOr(undefined, ["content"], fieldContent);
              const extention = pathOr(undefined, ["extention"], fieldContent);
              if (content === "isHidden") {
                fieldFormatted[fieldId] = { hidden: true };
              } else if (content === "isNotHidden") {
                fieldFormatted[fieldId] = { hidden: false };
              } else if (content === "isAssignedFrom" && extention) {
                fieldFormatted[fieldId] = { assignFrom: extention };
              }
            }
          });
        }
        return Object.keys(fieldFormatted).length > 0
          ? fieldFormatted
          : undefined;
      };

      const setActionSMSValue = () => {
        const content = pathOr(
          "",
          ["actionData", "System_SMSContentData"],
          actData
        );
        const param = pathOr(
          "",
          ["actionData", "System_SMSRecipient"],
          actData
        );
        return { paramName: param, value: content };
      };

      switch (actionType) {
        case "Branch":
          dialogTitle = "Branch";
          dialogFormContent = (
            <ConditionForm
              params={[...params]}
              conditionExp={conditionActionVal}
              onSubmit={newConditionVal => {
                setAct(currentActData => {
                  // creating action
                  if (creatingAction) {
                    return compose(
                      assocPath(["actionType"], "Branch"),
                      assocPath(
                        ["actionData", "System_BranchData"],
                        newConditionVal
                      )
                    )(currentActData) as any;
                  }

                  // editing action
                  return assocPath(
                    ["actionData", "System_BranchData"],
                    newConditionVal,
                    currentActData
                  );
                });
              }}
              onValidate={isValid => {
                console.log("isValid", isValid);
                setValidation(!!isValid);
              }}
            />
          );

          break;
        case "ChangeFieldVisibility":
          dialogTitle = "pass field visibility";
          dialogFormContent = (
            <ActionShowHideField
              fields={fields.map(field => ({
                id: field.id,
                label: field.label
              }))}
              params={setParamActionShowHideField()}
              values={
                setActionChangeFieldVisibilityValues() as {
                  [key: string]: ValueContent | undefined;
                }
              }
              onChange={val => {
                const newVal = setActionChangeFieldVisibilityPayload(val);
                setAct(currentActData => {
                  if (creatingAction) {
                    return compose(
                      assocPath(["actionType"], "ChangeFieldVisibility"),
                      assocPath(
                        ["actionData", "System_ChangeFieldVisibility"],
                        newVal
                      )
                    )(currentActData) as any;
                  }

                  // editing action
                  return assocPath(
                    ["actionData", "System_ChangeFieldVisibility"],
                    newVal,
                    currentActData
                  );
                });
              }}
              onValidate={isValid => setValidation(isValid)}
            />
          );
          break;
        case "SetParamValue":
          dialogTitle = "Set Parameter value";
          dialogFormContent = (
            <ActionSetParam
              params={params as any}
              values={setParamsActionVal}
              onValidate={isValid => setValidation(isValid)}
              onChange={newValues => {
                setAct(currentActData => {
                  console.log("newValues", newValues);
                  // creating action
                  if (creatingAction) {
                    return compose(
                      assocPath(["actionType"], "SetParamValue"),
                      assocPath(["actionData"], newValues)
                    )(currentActData) as any;
                  }

                  // editing action
                  return assocPath(["actionData"], newValues, currentActData);
                });
              }}
            />
          );

          break;
        case "Sleep":
          dialogTitle = "Sleep";
          dialogFormContent = (
            <ActionDelay
              value={delayActionVal}
              onValidate={isValid => setValidation(isValid)}
              onChange={timeDuration => {
                setAct(currentActData => {
                  // creating action
                  if (creatingAction) {
                    return compose(
                      assocPath(["actionType"], "Sleep"),
                      assocPath(
                        ["actionData", "System_SleepData"],
                        timeDuration
                      )
                    )(currentActData) as any;
                  }

                  // editing action
                  return assocPath(
                    ["actionData", "System_SleepData"],
                    timeDuration,
                    currentActData
                  );
                });
              }}
            />
          );

          break;
        case "SendSMS":
          dialogTitle = "Send SMS";
          dialogFormContent = (
            <ActionSMS
              params={setParamActionSMS()}
              inital={setActionSMSValue()}
              onValidate={isValid => setValidation(isValid)}
              onChange={values => {
                setAct(currentActData => {
                  // creating action
                  if (creatingAction) {
                    return compose(
                      assocPath(["actionType"], "SendSMS"),
                      assocPath(
                        ["actionData", "System_SMSContentData"],
                        values.value
                      ),
                      assocPath(
                        ["actionData", "System_SMSRecipient"],
                        values.paramName
                      )
                    )(currentActData) as any;
                  }
                  return compose(
                    assocPath(
                      ["actionData", "System_SMSContentData"],
                      values.value
                    ),
                    assocPath(
                      ["actionData", "System_SMSRecipient"],
                      values.paramName
                    )
                  )(currentActData) as any;
                });
              }}
            />
          );

          break;
        default:
          // empty
          break;
      }
    }

    if (creatingTrigger || editingTrigger) {
      const trigger: TriggerType = getTrigger(triggerIdx)(actData);
      const nextTriggerId = action.triggers ? action.triggers.length : 0;

      // TimePoint trigger
      const timepointTriggerVal = pathOr(
        undefined,
        ["triggerData", "timePoint"],
        trigger
      );

      // Duration trigger
      const durationTriggerParam = pathOr(
        "",
        ["triggerData", "paramName"],
        trigger
      );
      const durationTriggerVal = pathOr(
        "",
        ["triggerData", "duration"],
        trigger
      );

      // Condition trigger
      const conditionTriggerVal = pathOr(
        {},
        ["triggerData", "condition"],
        trigger
      );

      switch (triggerType) {
        case "TimePoint":
          dialogTitle = "Time Point";
          dialogFormContent = (
            <TimePoint
              initial={moment(timepointTriggerVal).toDate()}
              onChange={dataTimeVal => {
                setValidation(!!dataTimeVal);
                setAct(currentActData => {
                  // creating trigger
                  if (creatingTrigger) {
                    return assocPath(
                      ["triggers", nextTriggerId],
                      { triggerType, triggerData: { timePoint: dataTimeVal } },
                      currentActData
                    );
                  }

                  // editing trigger
                  return assocPath(
                    [
                      "triggers",
                      triggerIdx as number,
                      "triggerData",
                      "timePoint"
                    ],
                    dataTimeVal,
                    currentActData
                  );
                });
              }}
            />
          );

          break;
        case "TimeAfter":
          dialogTitle = "After";
          dialogFormContent = (
            <TriggerDuration
              params={params.filter(p => (p.type ? p.type === "date" : false))}
              paramName={durationTriggerParam}
              value={durationTriggerVal}
              onValidate={isValid => setValidation(isValid)}
              onChange={(duration, prName) => {
                setAct(currentActData => {
                  // creating trigger
                  if (creatingTrigger) {
                    return assocPath(
                      ["triggers", nextTriggerId],
                      {
                        triggerType,
                        triggerData: { paramName: prName, duration }
                      },
                      currentActData
                    );
                  }

                  // editing triggger
                  return assocPath(
                    ["triggers", triggerIdx as number, "triggerData"],
                    { paramName: prName, duration },
                    currentActData
                  );
                });
              }}
            />
          );

          break;
        case "TimeBefore":
          dialogTitle = "Before";
          dialogFormContent = (
            <TriggerDuration
              params={params.filter(p => (p.type ? p.type === "date" : false))}
              paramName={durationTriggerParam}
              value={durationTriggerVal}
              onValidate={isValid => setValidation(isValid)}
              onChange={(duration, prName) => {
                setAct(currentActData => {
                  // creating trigger
                  if (creatingTrigger) {
                    return assocPath(
                      ["triggers", nextTriggerId],
                      {
                        triggerType,
                        triggerData: { paramName: prName, duration }
                      },
                      currentActData
                    );
                  }

                  // editing trigger
                  return assocPath(
                    ["triggers", triggerIdx as number, "triggerData"],
                    { paramName: prName, duration },
                    currentActData
                  );
                });
              }}
            />
          );

          break;
        case "Condition":
          dialogTitle = "Condition";
          dialogFormContent = (
            <ConditionForm
              params={[...params]}
              conditionExp={conditionTriggerVal}
              onValidate={isValid => {
                setValidation(!!isValid);
              }}
              onSubmit={currentVal => {
                setAct(currentActData => {
                  // creating trigger
                  if (creatingTrigger) {
                    return assocPath(
                      ["triggers", nextTriggerId],
                      { triggerType, triggerData: { condition: currentVal } },
                      currentActData
                    );
                  }

                  // editing trigger
                  return assocPath(
                    [
                      "triggers",
                      triggerIdx as number,
                      "triggerData",
                      "condition"
                    ],
                    currentVal,
                    currentActData
                  );
                });
              }}
            />
          );
          break;
        case "PassPreviewed":
          dialogTitle = "Pass Previewed Event";
          setTriggerType(() => {
            setAct(currentActData => {
              const newActData = assocPath(
                ["triggers", nextTriggerId],
                { triggerType },
                currentActData
              );

              // creating trigger
              if (creatingTrigger) {
                handleSubmit(newActData)();
                return assocPath(
                  ["triggers", nextTriggerId],
                  { triggerType },
                  currentActData
                );
              }

              return currentActData;
            });

            return undefined;
          });
          break;
        case "PassAdded":
          dialogTitle = "Pass Added Event";
          setTriggerType(() => {
            setAct(currentActData => {
              const newActData = assocPath(
                ["triggers", nextTriggerId],
                { triggerType },
                currentActData
              );

              // creating trigger
              if (creatingTrigger) {
                handleSubmit(newActData)();
                return assocPath(
                  ["triggers", nextTriggerId],
                  { triggerType },
                  currentActData
                );
              }

              return currentActData;
            });

            return undefined;
          });
          break;
        case "PassDeleted":
          dialogTitle = "Pass Deleted Event";
          setTriggerType(() => {
            setAct(currentActData => {
              const newActData = assocPath(
                ["triggers", nextTriggerId],
                { triggerType },
                currentActData
              );

              // creating trigger
              if (creatingTrigger) {
                handleSubmit(newActData)();
                return assocPath(
                  ["triggers", nextTriggerId],
                  { triggerType },
                  currentActData
                );
              }

              return currentActData;
            });

            return undefined;
          });
          break;
        default:
          // empty
          break;
      }
    }
  }

  return (
    <Dialog title={dialogTitle} lockScroll visible={visible} onCancel={onClose}>
      <Dialog.Body>{dialogFormContent}</Dialog.Body>
      <Dialog.Footer>
        <Button onClick={onClose}>Cancel</Button>
        <ProtectedScopedComponent
          scopes={[
            "post:my-org-type-base-workflow:action",
            "put:my-org-type-base-workflow:action"
          ]}
        >
          {({ matchs }: { matchs: string[] }) => {
            const creatingValid =
              matchs.includes("post:my-org-type-base-workflow:action") &&
              creatingAction;
            const editingValid =
              matchs.includes("put:my-org-type-base-workflow:action") &&
              (editingAction || editingTrigger || creatingTrigger);

            showConfirmButton =
              showConfirmButton && (creatingValid || editingValid);

            return (
              showConfirmButton && (
                <Button
                  type="primary"
                  disabled={!valid}
                  onClick={handleSubmit(actData)}
                >
                  OK
                </Button>
              )
            );
          }}
        </ProtectedScopedComponent>
      </Dialog.Footer>
    </Dialog>
  );
};

export default NodeDetail;
