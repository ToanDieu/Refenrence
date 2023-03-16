import React, { FunctionComponent, useState } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import moment from "moment";

import { transTime } from "@/utils/time";
import { TriggerType } from "@/resources/actions";

import { Theme } from "@/components/theme";
import Icon from "@/components/units/Icon";
import Dropdown from "@/components/units/Dropdown";
import EditDropdown from "./EditDropdown";

/**
 * Shared styles
 */
const qualifierColor = (qual: string, theme?: Theme) => {
  switch (qual) {
    case "Any":
      return theme ? theme.sky : "#00FFFF";
    case "All":
      return theme ? theme.yellow : "#F3CC26";
    default:
      return "#F3CC26";
  }
};

const triggerStyle = ({
  qualifier,
  editing = false
}: {
  qualifier: string;
  editing: boolean;
}) => (theme: Theme) => css`
  cursor: default;  
  padding: 2px 0px 0px 7px;

  font-weight: bold;
  ${
    editing
      ? `
        padding: 5px 7px;

        border: 2px solid ${qualifierColor(qualifier, theme)};
        border-radius: 4px;

        .p-workflow-list:hover ~ & {
          color: ${theme.primary};
          border-color: white;
          background: white;
        }

        :hover {
          color: ${theme.primary};
          border-color: white;
          background: white;
        }
      `
      : `border-left: 3px solid ${qualifierColor(qualifier, theme)};`
  }  
  color: ${theme.textColor || "initial"};
`;
/**
 * End Shared styles
 */

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
  font-weight: normal;
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
 * QualifierCtrl internal component
 */
// Types
interface QualifierCtrlPrps {
  qual: string;
  onChangeQual: (qual: string) => void;
}

// Component
const QualifierCtrl: FunctionComponent<QualifierCtrlPrps> = ({
  qual,
  onChangeQual
}) => (
  <Dropdown
    css={css`
      display: inline-flex;
      min-width: 0px;
      z-index: 200;
    `}
    initial={qual}
    onChange={item => {
      if (item) {
        onChangeQual(item.id as string);
      }
    }}
    items={[
      {
        id: "Any",
        name: "ANY"
      },
      {
        id: "All",
        name: "ALL"
      }
    ]}
  />
);
/**
 * End QualifierCtrl
 */

/**
 * Qualifier internal component
 */
// Types
interface QualifierPrps {
  qualifier?: string;
}

// Component
const Qualifier = styled.span<QualifierPrps>`
  display: inline-block;
  padding: 0 5px;
  border-radius: 4px;
  color: black;
  background-color: ${({ qualifier, theme }) =>
    qualifier === "All" ? theme.yellow : "#00FFFF"};
  text-transform: uppercase;
`;
/**
 * End Qualifier
 */

/**
 * Trigger internal component
 */
// Types
interface TriggerPrps {
  qualifier?: "All" | "Any";
  editing?: boolean;
  triggerType:
    | "TimePoint"
    | "TimeBefore"
    | "TimeAfter"
    | "Condition"
    | "WebhookTrigger"
    | "PassDownloaded"
    | "PassAdded"
    | "PassDeleted"
    | "None";
  triggerData?: { [key: string]: any };
  onEdit?: () => void;
  onDelete?: () => void;
}

// Component
const Trigger: FunctionComponent<TriggerPrps> = ({
  qualifier = "NONE",
  editing = false,
  triggerType,
  triggerData = {},
  onEdit = () => console.log("edit"),
  onDelete = () => console.log("delete")
}) => {
  let title: string;
  let value: string | JSX.Element | JSX.Element[];
  let items;
  // console.log(triggerType, triggerData);
  switch (triggerType) {
    case "TimeAfter":
      title = "After";
      value = `{${triggerData.paramName}} ${triggerData.duration}`;
      break;
    case "TimeBefore":
      title = "Before";
      value = `{${triggerData.paramName}} ${triggerData.duration}`;
      break;
    case "TimePoint":
      title = "At";
      value = transTime(triggerData.timePoint);
      break;
    case "Condition":
      title = "Match:";
      value = explainCond(triggerData.condition);
      break;
    case "PassDownloaded":
      title = "Pass Event: ";
      value = "Downloaded Pass";
      items = [
        {
          id: "edit",
          name: "Edit",
          icon: "edit",
          disabled: true
        },
        {
          id: "delete",
          name: "Delete",
          icon: "trash"
        }
      ];
      onEdit = () => {};
      break;
    case "PassAdded":
      title = "Pass Event: ";
      value = "Added Pass";
      items = [
        {
          id: "edit",
          name: "Edit",
          icon: "edit",
          disabled: true
        },
        {
          id: "delete",
          name: "Delete",
          icon: "trash"
        }
      ];
      onEdit = () => {};
      break;
    case "PassDeleted":
      title = "Pass Event: ";
      value = "Deleted Pass";
      items = [
        {
          id: "edit",
          name: "Edit",
          icon: "edit",
          disabled: true
        },
        {
          id: "delete",
          name: "Delete",
          icon: "trash"
        }
      ];
      onEdit = () => {};
      break;
    default:
      return null;
  }

  return (
    <EditDropdown
      css={css`
        margin-top: 10px;

        &:first-child {
          margin-top: 0px;
        }
      `}
      items={items}
      onEdit={onEdit}
      onDelete={onDelete}
      editing={editing}
      disable={!editing}
      renderSelected={() => (
        <div css={triggerStyle({ qualifier, editing })}>
          {title}
          &nbsp;
          {value}
        </div>
      )}
    />
  );
};
/**
 * End Trigger
 */

/**
 * Triggers component
 */
// Styles
const wrapper = (theme: Theme) => css`
  margin: 0 auto;
  padding: 16px;

  background-color: ${theme.cyan || "#16837C"};
  border-bottom: 1px solid white;
  border-radius: 4px 4px 0 0;
  color: ${theme.textColor || "white"};
  font-family: ${theme.fontFamily};
  font-size: ${theme.fontSize || "16"}px;
  line-height: 1.45;
`;

// Types
interface TriggersPrps {
  editing?: boolean;
  qualifier: "All" | "Any";
  triggers: TriggerType[];
  onAdd?: () => void;
  onEditTrigger?: (triggerIdx: number) => void;
  onDeleteTrigger?: (triggerIdx: number) => void;
  onEditQuantifier?: (qual: "All" | "Any") => void;
}

// Component
const Triggers: FunctionComponent<TriggersPrps> = ({
  editing = false,
  triggers,
  qualifier,
  onAdd,
  onEditTrigger = idx => console.log("editing", idx),
  onDeleteTrigger = idx => console.log("deleting", idx),
  onEditQuantifier = qual => console.log("editing qual", qual)
}) => {
  const [qual, setQual] = useState(qualifier);

  return triggers.length > 0 || editing ? (
    <div css={wrapper}>
      {triggers.length > 1 && (
        <span>
          Matching &nbsp;
          {editing ? (
            <QualifierCtrl
              qual={qualifier}
              onChangeQual={qualVal => {
                setQual(qualVal as "Any" | "All");
                onEditQuantifier(qualVal as "Any" | "All");
              }}
            />
          ) : (
            <Qualifier qualifier={qual}>{`${qualifier}`}</Qualifier>
          )}
          &nbsp; of the following rules
        </span>
      )}
      {triggers.map((trigger, idx) => (
        <Trigger
          onEdit={() => onEditTrigger(idx)}
          onDelete={() => onDeleteTrigger(idx)}
          editing={editing}
          qualifier={qual}
          triggerType={trigger.triggerType || "None"}
          triggerData={trigger.triggerData}
        />
      ))}
      {editing && (
        <div role="presentation" onClick={onAdd}>
          <Icon
            css={css`
              line-height: 1;
              margin-top: ${triggers.length ? 16 : 0}px;
              cursor: pointer;
            `}
            iconName="add"
            label="Add triggers"
            size={22}
          />
        </div>
      )}
    </div>
  ) : null;
};
/**
 * End Triggers
 */

export default Triggers;
