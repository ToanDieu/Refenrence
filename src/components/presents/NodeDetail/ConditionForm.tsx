import React, { FunctionComponent, useState, useEffect } from "react";
import { Form, Input, Select } from "element-react";
import { css } from "@emotion/core";
import { get, set, cloneDeep } from "lodash/fp";
import moment from "moment";
import { dissocPath } from "ramda";

import Button from "@/components/units/Button";
import DropDown from "@/components/units/Dropdown";
import DateTimePicker from "@/components/blocks/DatetimePicker";

import {
  emailPattern,
  phonePatternStandard,
  phonePatternWithDomainCode,
  phonePatternWithVnDomain,
  timeRegex
} from "@/constants/index";

const formItemStyle = css`
  margin-bottom: 0px;
`;
const DateTimePickerStyle = css`
  width: 100%;
`;
const rowStyle = css`
  display: inline-flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: stretch;
  align-items: center;

  & > * {
    margin-right: 10px;

    :last-child {
      margin-right: 0px;
    }
  }
`;

const errorStyle = css`
  color: #ff4949;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  margin-bottom: 22px;
  top: 100%;
  left: 0;
`;

const conditionDateOperator = [
  {
    label: "is before",
    op: "<"
  },
  { label: "is on or before", op: "<=" },
  { label: "is after", op: ">" },
  { label: "is on or after", op: ">=" },
  { label: "is", op: "==" },
  { label: "is not", op: "!=" }
];

const conditionNumberOperator = [
  { label: "less than", op: "<" },
  { label: "less or equal", op: "<=" },
  { label: "greater", op: ">" },
  { label: "greater or equal", op: ">=" },
  { label: "equal to", op: "==" },
  { label: "not equal to", op: "!=" }
];

const conditionTextOperator = [
  { label: "is", op: "==" },
  { label: "is not", op: "!=" }
];

export const getOpConditionOp = (label: string) => {
  let foundOp = conditionTextOperator.find(element => {
    return element.label === label;
  });

  if (!foundOp) {
    foundOp = conditionDateOperator.find(element => {
      return element.label === label;
    });
  }

  if (!foundOp) {
    foundOp = conditionNumberOperator.find(element => {
      return element.label === label;
    });
  }

  return foundOp ? foundOp.op : undefined;
};

export const getLabelConditionOp = (typeParam: string, op: string) => {
  switch (typeParam) {
    case "text": {
      const foundOp = conditionTextOperator.find(element => {
        return element.op === op;
      });
      return foundOp ? foundOp.label : "";
    }
    case "email": {
      const foundOp = conditionTextOperator.find(element => {
        return element.op === op;
      });
      return foundOp ? foundOp.label : "";
    }
    case "mobileNumber": {
      const foundOp = conditionTextOperator.find(element => {
        return element.op === op;
      });
      return foundOp ? foundOp.label : "";
    }
    case "date": {
      const foundOp = conditionDateOperator.find(element => {
        return element.op === op;
      });
      return foundOp ? foundOp.label : "";
    }
    case "number": {
      const foundOp = conditionNumberOperator.find(element => {
        return element.op === op;
      });
      return foundOp ? foundOp.label : "";
    }
    case "duration": {
      const foundOp = conditionNumberOperator.find(element => {
        return element.op === op;
      });
      return foundOp ? foundOp.label : "";
    }
    case "boolean": {
      const foundOp = conditionTextOperator.find(element => {
        return element.op === op;
      });
      return foundOp ? foundOp.label : "";
    }
    default:
      return "";
  }
};

export const getListLabelConditionOp = (typeParam: string) => {
  switch (typeParam) {
    case "text":
      return conditionTextOperator.map(op => {
        return op.label;
      });
    case "email":
      return conditionTextOperator.map(op => {
        return op.label;
      });
    case "mobileNumber":
      return conditionTextOperator.map(op => {
        return op.label;
      });
    case "date":
      return conditionDateOperator.map(op => {
        return op.label;
      });
    case "number":
      return conditionNumberOperator.map(op => {
        return op.label;
      });
    case "duration":
      return conditionNumberOperator.map(op => {
        return op.label;
      });
    case "boolean":
      return conditionTextOperator.map(op => {
        return op.label;
      });
    default:
      return [];
  }
};

interface paramType {
  name: string;
  type?: string;
}

interface ComparatorExp {
  var: string;
  op: string;
  val: any;
  error?: string;
}

interface Comparator {
  comparator?: string;
  rules: (Comparator | ComparatorExp)[];
}

interface ConditionFormPrps {
  conditionExp: Comparator | ComparatorExp;
  onSubmit: (value: Comparator | ComparatorExp | undefined) => any;
  onCancel?: () => any;
  params?: paramType[];
  loading?: boolean;
  onValidate?: (valid: boolean | undefined) => void;
}

const ConditionForm: FunctionComponent<ConditionFormPrps> = ({
  conditionExp,
  onSubmit,
  params = [],
  onValidate = () => {}
}) => {
  const [conditionExpState, setConditionExpState] = useState<
    Comparator | ComparatorExp
  >();
  const [isVal, setValid] = useState<boolean | undefined>(undefined);

  const setIntervalRef = (
    path: any[],
    value: string,
    currentCondition: Comparator | ComparatorExp | undefined
  ) => {
    let newCondition;
    if (currentCondition) {
      newCondition = set(path, value, currentCondition);
      return newCondition;
    }
    return currentCondition;
  };

  const checkEmptyAllValues = (
    currentCondition: Comparator | ComparatorExp | undefined
  ) => {
    let isValid = true;
    if (
      (currentCondition as Comparator) &&
      (currentCondition as Comparator).rules
    ) {
      (currentCondition as Comparator).rules.forEach(rule => {
        const comparatorExp = rule as ComparatorExp;
        if (
          (comparatorExp.error && comparatorExp.error !== "") ||
          !comparatorExp.op ||
          comparatorExp.op === "" ||
          !comparatorExp.var ||
          comparatorExp.var === ""
        ) {
          isValid = false;
        }
      });
    } else if (currentCondition as ComparatorExp) {
      const comparatorExp = currentCondition as ComparatorExp;
      if (
        (comparatorExp.error && comparatorExp.error !== "") ||
        !comparatorExp.op ||
        comparatorExp.op === "" ||
        !comparatorExp.var ||
        comparatorExp.var === ""
      ) {
        isValid = false;
      }
    }

    return isValid;
  };

  const checkParamIsExist = (
    currentCondition: Comparator | ComparatorExp | undefined
  ) => {
    let newCondition = currentCondition;
    const messageError =
      "The parameter does not exist, please edit or remove this comparator expression";
    if (
      (currentCondition as Comparator) &&
      (currentCondition as Comparator).rules
    ) {
      (currentCondition as Comparator).rules.forEach((rule, i) => {
        const comparatorExp = rule as ComparatorExp;
        if (!comparatorExp.var) {
          return;
        }
        const found = params.findIndex(param => {
          return param.name === comparatorExp.var;
        });
        if (found < 0) {
          newCondition = setIntervalRef(
            ["rules", i, "error"],
            messageError,
            newCondition
          );
        }
      });
    } else if (currentCondition as ComparatorExp) {
      const comparatorExp = currentCondition as ComparatorExp;
      const found = params.findIndex(param => {
        return param.name === comparatorExp.var;
      });
      if (found < 0 && comparatorExp.var) {
        newCondition = setIntervalRef(["error"], messageError, newCondition);
      }
    }

    return newCondition;
  };

  const validate = (
    path: any[],
    newValue: string,
    currentCondition: Comparator | ComparatorExp | undefined
  ) => {
    let newCondition;
    if (currentCondition) {
      let pathVar;
      let root = [];
      if (currentCondition as Comparator) {
        root = [...path.slice(0, path.length - 1)];
        pathVar = [...path.slice(0, path.length - 1), "var"];
      } else if (currentCondition as ComparatorExp) {
        pathVar = ["var"];
      }

      const Var = get(pathVar || "", currentCondition);
      const foundParam = params.find(param => {
        return param.name === Var;
      });
      if (!foundParam) {
        return currentCondition;
      }

      if (
        foundParam.type !== "text" &&
        newValue.trim().replace(" ", "").length === 0
      ) {
        newCondition = setIntervalRef(
          [...root, "error"],
          "required",
          currentCondition
        );
      } else {
        switch (foundParam.type) {
          case "email":
            if (!emailPattern.test(newValue)) {
              newCondition = setIntervalRef(
                [...root, "error"],
                "Invalid email",
                currentCondition
              );
            } else {
              newCondition = setIntervalRef(
                [...root, "error"],
                "",
                currentCondition
              );
            }
            break;
          case "mobileNumber":
            if (
              !phonePatternStandard.test(newValue) &&
              !phonePatternWithDomainCode.test(newValue) &&
              !phonePatternWithVnDomain.test(newValue)
            ) {
              newCondition = setIntervalRef(
                [...root, "error"],
                "Invalid phone number. Please use format +49xxxxxxxxxx or 0xxxxxxxxxx (where x are digits, total min. 9 digits, max. 15 digits)",
                currentCondition
              );
            } else {
              newCondition = setIntervalRef(
                [...root, "error"],
                "",
                currentCondition
              );
            }
            break;
          case "number": {
            if (Number.isNaN(Number(newValue))) {
              newCondition = setIntervalRef(
                [...root, "error"],
                "Only digits",
                currentCondition
              );
            } else {
              newCondition = setIntervalRef(
                [...root, "error"],
                "",
                currentCondition
              );
            }
            break;
          }
          case "duration":
            if (!timeRegex.test(newValue)) {
              newCondition = setIntervalRef(
                [...root, "error"],
                "Please use format 00h00m00s (Where 00 are digits)",
                currentCondition
              );
            } else {
              newCondition = setIntervalRef(
                [...root, "error"],
                "",
                currentCondition
              );
            }
            break;
          default:
            newCondition = setIntervalRef(
              [...root, "error"],
              "",
              currentCondition
            );
            break;
        }
      }

      newCondition = checkParamIsExist(newCondition);

      return newCondition;
    }
    return currentCondition;
  };

  const formatValueByType = (type: string, value: string) => {
    switch (type) {
      case "number":
        if (Number.isNaN(Number(value))) {
          return value;
        }
        return Number(value);
      case "boolean":
        if (value === "true") {
          return true;
        }
        if (value === "false") {
          return false;
        }

        return value;
      default:
        return value;
    }
  };

  const normalize = (
    inputCondition: Comparator | ComparatorExp | undefined
  ) => {
    let condition = cloneDeep(inputCondition);

    if (condition) {
      if ((condition as Comparator).rules) {
        (condition as Comparator).rules.forEach((comparatorExp, index) => {
          if (comparatorExp as ComparatorExp) {
            const type = getTypeParam(get(["rules", index, "var"], condition));
            const newValue = formatValueByType(
              type,
              (comparatorExp as ComparatorExp).val
            );

            if (condition) {
              condition = set(["rules", index, "val"], newValue, condition);
              condition = dissocPath(["rules", index, "error"], condition);
            }
          }
        });
      } else if (condition as ComparatorExp) {
        const type = getTypeParam(get(["var"], condition));
        const newValue = formatValueByType(
          type,
          (condition as ComparatorExp).val
        );

        if (condition) {
          condition = set(["val"], newValue, condition);
          condition = dissocPath(["error"], condition);
        }
      }
    }

    return condition;
  };

  const onChange = (path: any[], newValue: string) => {
    setConditionExpState((currentCondition: any) => {
      let newCondition;
      if (currentCondition) {
        newCondition = set(path, newValue, currentCondition);
        if (path.length > 0 && path[path.length - 1] === "val") {
          newCondition = validate(path, newValue, newCondition);
        }
      }

      setValid(checkEmptyAllValues(newCondition));
      onSubmit(normalize(newCondition));

      return newCondition;
    });
  };

  const onChangeOp = (path: any[], newValue: string) => {
    const newOp = getOpConditionOp(newValue);
    if (newOp) {
      onChange(path, newOp);
    }
  };

  const onChangeComparator = (value: string) => {
    setConditionExpState((currentCondition: any) => {
      if (currentCondition) {
        let newCondition;
        if (value === "AND") {
          newCondition = set(["comparator"], "&&", currentCondition);
        } else {
          newCondition = set(["comparator"], "||", currentCondition);
        }

        onSubmit(newCondition);
        setValid(checkEmptyAllValues(newCondition));

        return newCondition;
      }

      return currentCondition;
    });
  };

  const addExp = () => {
    setConditionExpState((currentCondition: any) => {
      let newCondition: any;
      if ((currentCondition as Comparator).rules) {
        (currentCondition as Comparator).rules.push({
          var: "",
          op: "",
          val: ""
        });
        newCondition = currentCondition;
      } else {
        newCondition = {
          comparator: "&&",
          rules: [
            { ...currentCondition },
            {
              op: "",
              val: "",
              var: ""
            }
          ]
        };
      }
      setValid(false);

      onSubmit(newCondition);

      return newCondition;
    });
  };

  const subExp = (path: string[]) => {
    setConditionExpState((currentCondition: any) => {
      if ((currentCondition as Comparator).rules) {
        const index = parseInt(path[path.length - 1], 10);
        (currentCondition as Comparator).rules.splice(index, 1);
        let newCondition = currentCondition;
        if ((currentCondition as Comparator).rules.length === 1) {
          newCondition = {
            ...(currentCondition as Comparator).rules[0]
          };
        }

        onSubmit(newCondition);
        setValid(checkEmptyAllValues(newCondition));

        return newCondition;
      }

      return currentCondition;
    });
  };

  const dropdown = (
    placeHolder: string,
    values: string[],
    defaultValue: string,
    onchange: (value: string) => any
  ) => {
    return (
      <Select
        css={css`
          flex-basis: 260px;
        `}
        value={defaultValue}
        placeholder={placeHolder}
        onChange={value => onchange(value)}
      >
        {values.map(value => {
          return <Select.Option key={value} label={value} value={value} />;
        })}
      </Select>
    );
  };

  const getTypeParam = (paramName: string) => {
    const res = params.find(param => {
      return param.name === paramName;
    });

    if (res && res.type) {
      return res.type;
    }
    return "";
  };

  const explainCond = (
    comp: Comparator | ComparatorExp | undefined,
    quantifier?: JSX.Element,
    quantifierSelected?: boolean,
    path?: any[]
  ) => {
    if (!comp) {
      return <span />;
    }

    if ((comp as Comparator).comparator) {
      return (comp as Comparator).rules.map((rule, i) => {
        let quantifierSelector: JSX.Element | undefined = quantifier;
        const qualStyle = css`
          flex-basis: 210px;
        `;

        if (i) {
          if (quantifierSelected || i > 1) {
            quantifierSelector = (
              <span css={qualStyle}>
                {(comp as Comparator).comparator === "&&" ? "AND" : "OR"}
              </span>
            );
          } else {
            quantifierSelector = (
              <Select
                css={qualStyle}
                value={(comp as Comparator).comparator === "&&" ? "AND" : "OR"}
                onChange={value => onChangeComparator(value)}
              >
                <Select.Option label="OR" value="OR" />
                <Select.Option label="AND" value="AND" />
              </Select>
            );
          }
        }
        const subPath = path ? path.slice(0) : [];
        subPath.push("rules");
        subPath.push(i);
        return (
          <React.Fragment>
            {explainCond(rule, quantifierSelector, true, subPath)}
          </React.Fragment>
        );
      });
    }
    const { var: Var, op: Op, val: Val, error: Er } = comp as ComparatorExp;
    let type: string = "";

    type = getTypeParam(Var);
    const opString = getLabelConditionOp(type, Op);

    const varOnchange = (value: string) => {
      const varPath = path ? path.slice(0) : [];
      varPath.push("var");
      onChange(varPath || [], `${value}`);

      type = getTypeParam(value);
      if (type === "date") {
        let defaultDate;
        if (Val && Val !== "") {
          const valueFormatted = moment(Val);
          if (valueFormatted.isValid()) {
            defaultDate = Val;
          } else {
            defaultDate = moment(defaultDate).toISOString(true);
          }
        } else {
          const valueFormatted = moment(defaultDate);
          defaultDate = Date.now();
          defaultDate = valueFormatted.toISOString(true);
        }

        const clonePath = path ? path.slice(0) : [];
        clonePath.push("val");
        onChange(clonePath || [], `${defaultDate}`);
      } else {
        const clonePath = path ? path.slice(0) : [];
        clonePath.push("val");
        onChange(clonePath || [], "");
      }
    };

    const opOnchange = (value: string) => {
      if (path) {
        path.push("op");
      }
      onChangeOp(path || [], `${value}`);
    };

    const inputMapper = (prType: string) => {
      switch (prType) {
        case "date": {
          return (
            <DateTimePicker
              css={DateTimePickerStyle}
              initial={moment(Val).toDate()}
              onChange={value => {
                if (path) {
                  path.push("val");
                }
                onChange(path || [], `${value}`);
              }}
            />
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
          return (
            <DropDown
              css={css`
                && span {
                  height: 50px;
                  line-height: 50px;
                }
              `}
              initial={Val !== undefined ? Val.toString() : ""}
              items={items}
              onChange={value => {
                if (value) {
                  if (path) {
                    path.push("val");
                  }
                  onChange(path || [], `${value.id}`);
                }
              }}
            />
          );
        }
        default: {
          return (
            <Input
              css={css`
                flex: auto;
              `}
              placeholder="value"
              value={Val}
              onChange={value => {
                if (path) {
                  path.push("val");
                }
                onChange(path || [], `${value}`);
              }}
            />
          );
        }
      }
    };

    return (
      <div>
        <Form.Item css={formItemStyle}>
          <div css={rowStyle}>
            {quantifier}
            {dropdown(
              "Param",
              params.map(param => param.name),
              Var,
              varOnchange
            )}
            {dropdown(
              "Condition operator",
              getListLabelConditionOp(type),
              opString,
              opOnchange
            )}
            {inputMapper(type)}
            {quantifier ? (
              <Button
                iconName="close"
                iconColor="iherit"
                border="none"
                padding="0px 0px"
                iconSize={30}
                onClick={() => {
                  subExp(path || []);
                }}
              />
            ) : (
              ""
            )}
          </div>
        </Form.Item>
        <div css={errorStyle}>{Er}</div>
      </div>
    );
  };

  useEffect(() => {
    onValidate(isVal);
  }, [isVal]);

  useEffect(() => {
    let conditionExpClone = cloneDeep(conditionExp);
    conditionExpClone =
      checkParamIsExist(conditionExpClone) || conditionExpClone;
    setConditionExpState(conditionExpClone);
  }, []);

  return (
    <Form>
      {explainCond(conditionExpState, undefined, false, [])}
      <Button
        label="Add condition(s)"
        iconName="add"
        iconColor="iherit"
        border="none"
        padding="0px 0px"
        iconSize={24}
        onClick={() => {
          addExp();
        }}
      />
    </Form>
  );
};

export default ConditionForm;
