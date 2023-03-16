import React, { FunctionComponent } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import moment from "moment";
import { transTime } from "@/utils/time";
import { ActionType } from "@/resources/actions";
import { Theme } from "@/components/theme";
import Icon from "@/components/units/Icon";
import pathOr from "ramda/es/pathOr";
import EditDropdown from "./EditDropdown";
import { FieldMedia } from "@/resources/bases";

/**
 * explainCond internal function
 * transform comparator rules into set of React component
 */

// Styles
const comparatorExp = css`
  font-weight: bold;
`;

const comparatorStyl = (theme: Theme) => css`
  color: ${theme.yellow};
`;

interface ComparatorExp {
  var: string;
  op: string;
  val: any;
}
interface Comparator {
  comparator?: string;
  rules: (Comparator | ComparatorExp)[];
}

// Main transform function
function explainCond(
  comp: Comparator | ComparatorExp
): JSX.Element | JSX.Element[] {
  if (!comp) {
    return <span />;
  }

  if ((comp as Comparator).comparator) {
    return (comp as Comparator).rules.map((rule, i) => (
      <React.Fragment>
        <span css={comparatorStyl}>
          {i
            ? ` ${(comp as Comparator).comparator === "&&" ? "AND" : "OR"} `
            : ""}
        </span>
        <span>{explainCond(rule)}</span>
      </React.Fragment>
    ));
  }

  const { var: Var, op: Op, val: Val } = comp as ComparatorExp;

  let opString: string;
  let type: string;
  if (moment(Val, moment.ISO_8601, true).isValid()) {
    type = "time";
  } else {
    type = "none";
  }

  switch (type) {
    case "time":
      switch (Op) {
        case "<":
          opString = "is before";
          break;
        case "<=":
          opString = "is on or before";
          break;
        case ">":
          opString = "is after";
          break;
        case ">=":
          opString = "is on or after";
          break;
        case "==":
          opString = "is";
          break;
        case "!=":
          opString = "is not";
          break;
        default:
          opString = Op;
          break;
      }
      break;
    default:
      switch (Op) {
        case "<":
          opString = "less than";
          break;
        case "<=":
          opString = "less or equal";
          break;
        case ">":
          opString = "greater";
          break;
        case ">=":
          opString = "greater or equal";
          break;
        case "==":
          opString = "equal to";
          break;
        case "!=":
          opString = "not equal to";
          break;
        default:
          opString = Op;
          break;
      }
      break;
  }

  return (
    <span css={comparatorExp}>{`{${Var}} ${opString} ${transTime(Val)}`}</span>
  );
}
/**
 * End explainCond
 */

/**
 * ActionTitle internal component
 */
// Types
interface ActionTitlePrps {
  className?: string;
  icon: string;
  title: string | (() => React.ReactNode);
}

// Component
const ActionTitle: FunctionComponent<ActionTitlePrps> = ({
  icon,
  title,
  className
}) => {
  return <Icon className={className} iconName={icon} label={title} size={22} />;
};
/**
 * End ActionTitle
 */

/**
 * ActionContent internal component
 */
// Types
const ActionContent = styled.div<{ editing?: boolean }>`
  line-height: 1.45;
  padding-top: 8px;
  white-space: pre-wrap;

  ${props =>
    props.editing
      ? `
        margin-top: 15px;
        padding: 5px 7px;

        border: 2px solid white;
        border-radius: 4px;
        cursor: default;
      `
      : ``}
`;
/**
 * End ActionContent
 */

// SetContent internal styled component
const SetContent = styled.div<{ editing?: boolean }>`
  font-weight: bold;
`;

/**
 * Action component
 */
// Styles
const wrapper = (theme: Theme) => css`
  margin: 0 auto;
  padding: 16px;

  background-color: ${theme.blue || "#1B5272"};
  color: ${theme.textColor || "white"};
  font-family: ${theme.fontFamily};
  font-size: ${theme.fontSize || "16"}px;
`;

const smsContent = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Types
interface ActionPrps {
  action: ActionType;
  className?: string;
  editing?: boolean;
  deletable?: boolean;
  onEditAction?: (actionId: number) => void;
  fields: FieldMedia[];
  onDeleteAction?: (actionId: number) => void;
}

// Component
const Action: FunctionComponent<ActionPrps> = ({
  action,
  editing = false,
  className,
  fields = [],
  deletable = false,
  onEditAction = actionId => console.log("editing action:", actionId),
  onDeleteAction = actionId => console.log("deleting action:", actionId)
}) => {
  const data = action.actionData || {};
  let content: JSX.Element | JSX.Element[] | null = null;
  let title = null;
  switch (action.actionType) {
    case "Branch":
      title = (
        <ActionTitle
          icon="question"
          title="Is the following condition(s) matched?"
        />
      );
      content = (
        <ActionContent editing={editing}>
          {explainCond(data.System_BranchData)}
        </ActionContent>
      );
      break;
    case "Sleep":
      title = <ActionTitle icon="time" title="Delay" />;
      content = (
        <ActionContent
          editing={editing}
          css={css`
            font-weight: bold;
            width: fit-content;
          `}
        >
          {data.System_SleepData}
        </ActionContent>
      );
      break;
    case "SetParamValue":
      title = <ActionTitle icon="message" title="Set content" />;
      content = (
        <ActionContent editing={editing}>
          {Object.keys(data).map(key => (
            <SetContent>{`{${key}} to "${data[key]}"`}</SetContent>
          ))}
        </ActionContent>
      );
      break;
    case "SendSMS":
      title = <ActionTitle icon="message" title="Send SMS" />;
      content = (
        <ActionContent editing={editing}>
          <SetContent>
            <React.Fragment>
              <div
                css={css`
                  display: flex;
                `}
              >
                &quot;
                <div css={smsContent}>{data.System_SMSContentData}</div>
                &quot;
              </div>
              {`send to {${data.System_SMSRecipient}}`}
            </React.Fragment>
          </SetContent>
        </ActionContent>
      );
      break;
    case "ChangeFieldVisibility":
      title = <ActionTitle icon="view-circle" title="Pass field visibility" />;
      content = (
        <ActionContent editing={editing}>
          {Object.keys(data.System_ChangeFieldVisibility).map(key => {
            const maxLengthLabel = 40;
            let operator = `is visible`;
            let paramName = ``;
            let label = `(empty)`;
            if (
              pathOr(
                false,
                ["System_ChangeFieldVisibility", key, "assignFrom"],
                data
              )
            ) {
              paramName = `{${pathOr(
                ``,
                ["System_ChangeFieldVisibility", key, "assignFrom"],
                data
              )}}`;
              operator = `is visible if ${paramName} is true`;
            } else if (
              pathOr(
                false,
                ["System_ChangeFieldVisibility", key, "hidden"],
                data
              )
            ) {
              operator = `is hidden`;
            }

            const field = fields.find(fieldID => {
              return fieldID.id === key;
            });
            if (field) {
              // cut short label
              label = field.label.substring(0, maxLengthLabel);
              if (field.label.length > maxLengthLabel) {
                label = `${label}...`;
              }
            }

            return (
              <SetContent>
                {`"(${key}) ${label}" ${operator}`}
                {data[key]}
              </SetContent>
            );
          })}
        </ActionContent>
      );
      break;
    default:
      break;
  }

  const items = [
    {
      id: "edit",
      name: "Edit",
      icon: "edit"
    },
    {
      id: "delete",
      disabled: !deletable,
      name: "Delete",
      icon: "trash"
    }
  ];

  return (
    <div className={className} css={wrapper}>
      {title}
      {content && (
        <EditDropdown
          css={css`
            min-width: 100px;
            width: 100%;
          `}
          editing={editing}
          items={items}
          disable={!editing}
          onEdit={() => onEditAction(action.id as number)}
          onDelete={() => onDeleteAction(action.id as number)}
          renderSelected={() => content}
        />
      )}
    </div>
  );
};
/**
 * End Action component
 */

export default Action;
