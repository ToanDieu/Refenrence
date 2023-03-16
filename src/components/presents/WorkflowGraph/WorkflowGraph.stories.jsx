import React from "react";
import { css } from "@emotion/core";
import { storiesOf } from "@storybook/react";
import WorkflowGraph from "@/components/presents/WorkflowGraph";
import Dropdown from "@/components/units/Dropdown";

const actions = [
  {
    id: 1,
    workflowID: 1,
    actionType: "Sleep",
    acceptActionID: 2,
    rejectActionID: undefined,
    triggerQuantifier: "All",
    triggers: [
      {
        triggerData: {
          Duration: "2h15m0s",
          ParamName: "added"
        },
        triggerType: "TimeAfter"
      },
      {
        triggerData: {
          Duration: "2h15m0s",
          ParamName: "hook"
        },
        triggerType: "TimeBefore"
      }
    ],
    actionData: {
      System_SleepData: "2h30m0s"
    },
    createdAt: "1982-12-19T13:15:56Z",
    deletedAt: "2000-02-15T10:05:11Z",
    updatedAt: "1984-04-07T06:26:29Z"
  },
  {
    id: 2,
    workflowID: 1,
    actionType: "Branch",
    acceptActionID: 3,
    rejectActionID: 4,
    triggerQuantifier: "Any",
    triggers: [
      {
        triggerData: {
          condition: {
            comparator: "||",
            rules: [
              {
                comparator: "&&",
                rules: [
                  {
                    op: "<",
                    val: "2019-03-28T11:39:43+07:00",
                    var: "a"
                  },
                  {
                    op: "in",
                    val: [1, 2, 3],
                    var: "b"
                  }
                ]
              },
              {
                comparator: "&&",
                rules: [
                  {
                    op: "!=",
                    val: "string",
                    var: "c"
                  },
                  {
                    op: ">=",
                    val: 4,
                    var: "d"
                  }
                ]
              }
            ]
          }
        },
        triggerType: "Condition"
      },
      {
        triggerData: {
          Duration: "2h15m0s",
          ParamName: "hook"
        },
        triggerType: "TimeAfter"
      }
    ],
    actionData: {
      System_BranchData: {
        comparator: "||",
        rules: [
          {
            comparator: "&&",
            rules: [
              {
                op: "<",
                val: "2019-03-28T11:39:43+07:00",
                var: "a"
              },
              {
                op: "in",
                val: [1, 2, 3],
                var: "b"
              }
            ]
          },
          {
            comparator: "&&",
            rules: [
              {
                op: "!=",
                val: "string",
                var: "c"
              },
              {
                op: ">=",
                val: 4,
                var: "d"
              }
            ]
          }
        ]
      }
    },
    createdAt: "1982-12-19T13:15:56Z",
    deletedAt: "2000-02-15T10:05:11Z",
    updatedAt: "1984-04-07T06:26:29Z"
  },
  {
    id: 3,
    workflowID: 1,
    actionType: "Branch",
    acceptActionID: 5,
    rejectActionID: 6,
    triggerQuantifier: undefined,
    triggers: [
      {
        triggerData: {
          timePoint: "1982-12-19T13:15:56Z"
        },
        triggerType: "TimePoint"
      }
    ],
    actionData: {
      System_BranchData: {
        op: ">",
        val: 10,
        var: "clicked"
      }
    },
    createdAt: "1982-12-19T13:15:56Z",
    deletedAt: "2000-02-15T10:05:11Z",
    updatedAt: "1984-04-07T06:26:29Z"
  },
  {
    id: 4,
    workflowID: 1,
    actionType: "SetParamValue",
    acceptActionID: 8,
    rejectActionID: undefined,
    triggerQuantifier: "All",
    triggers: [],
    actionData: {
      IssuerName: "Miss Moneny Penny"
    },
    createdAt: "1982-12-19T13:15:56Z",
    deletedAt: "2000-02-15T10:05:11Z",
    updatedAt: "1984-04-07T06:26:29Z"
  },
  {
    id: 8,
    workflowID: 1,
    actionType: "Branch",
    acceptActionID: 11,
    rejectActionID: undefined,
    triggerQuantifier: "All",
    triggers: [
      {
        triggerData: {
          Duration: "2h15m0s",
          ParamName: "hook"
        },
        triggerType: "TimeAfter"
      },
      {
        triggerData: {
          Duration: "2h15m0s",
          ParamName: "hook"
        },
        triggerType: "TimeAfter"
      }
    ],
    actionData: {
      System_BranchData: {
        op: "<",
        val: "2019-03-28T11:39:43+07:00",
        var: "a"
      }
    },
    createdAt: "1982-12-19T13:15:56Z",
    deletedAt: "2000-02-15T10:05:11Z",
    updatedAt: "1984-04-07T06:26:29Z"
  },
  {
    id: 11,
    workflowID: 1,
    actionType: "Branch",
    acceptActionID: undefined,
    rejectActionID: undefined,
    triggerQuantifier: "All",
    triggers: [
      {
        triggerData: {
          Duration: "2h15m0s",
          ParamName: "hook"
        },
        triggerType: "TimeAfter"
      },
      {
        triggerData: {
          Duration: "2h15m0s",
          ParamName: "hook"
        },
        triggerType: "TimeAfter"
      }
    ],
    actionData: {
      System_BranchData: {
        op: "<",
        val: "2019-03-28T11:39:43+07:00",
        var: "a"
      }
    },
    createdAt: "1982-12-19T13:15:56Z",
    deletedAt: "2000-02-15T10:05:11Z",
    updatedAt: "1984-04-07T06:26:29Z"
  },
  {
    id: 5,
    workflowID: 1,
    actionType: "SetParamValue",
    acceptActionID: undefined,
    rejectActionID: undefined,
    triggerQuantifier: "All",
    triggers: [
      {
        triggerData: {
          Duration: "2h15m0s",
          ParamName: "hook"
        },
        triggerType: "TimeAfter"
      },
      {
        triggerData: {
          Duration: "2h15m0s",
          ParamName: "hook"
        },
        triggerType: "TimeAfter"
      }
    ],
    actionData: {
      IssuerName: "Miss Moneny Penny"
    },
    createdAt: "1982-12-19T13:15:56Z",
    deletedAt: "2000-02-15T10:05:11Z",
    updatedAt: "1984-04-07T06:26:29Z"
  },
  {
    id: 6,
    workflowID: 1,
    actionType: "SetParamValue",
    acceptActionID: 7,
    rejectActionID: undefined,
    triggerQuantifier: "All",
    triggers: [
      {
        triggerData: {
          Duration: "2h15m0s",
          ParamName: "hook"
        },
        triggerType: "TimeAfter"
      },
      {
        triggerData: {
          Duration: "2h15m0s",
          ParamName: "hook"
        },
        triggerType: "TimeAfter"
      }
    ],
    actionData: {
      IssuerName: "Miss Moneny Penny"
    },
    createdAt: "1982-12-19T13:15:56Z",
    deletedAt: "2000-02-15T10:05:11Z",
    updatedAt: "1984-04-07T06:26:29Z"
  },
  {
    id: 7,
    workflowID: 1,
    actionType: "SetParamValue",
    acceptActionID: undefined,
    rejectActionID: undefined,
    triggerQuantifier: "All",
    triggers: [
      {
        triggerData: {
          Duration: "2h15m0s",
          ParamName: "hook"
        },
        triggerType: "TimeAfter"
      },
      {
        triggerData: {
          Duration: "2h15m0s",
          ParamName: "hook"
        },
        triggerType: "TimeAfter"
      }
    ],
    actionData: {
      IssuerName: "Miss Moneny Penny"
    },
    createdAt: "1982-12-19T13:15:56Z",
    deletedAt: "2000-02-15T10:05:11Z",
    updatedAt: "1984-04-07T06:26:29Z"
  }
];

const EditMode = () => {
  const [isEditMode, setEditting] = React.useState(false);

  return (
    <React.Fragment>
      <Dropdown
        css={css`
          float: right;
        `}
        initial="view"
        items={[
          {
            id: "edit",
            name: "Edit Mode"
          },
          {
            id: "view",
            name: "View Mode"
          }
        ]}
        iconName="chevron-down"
        onChange={item => {
          if (item.id === "edit") {
            setEditting(true);
            return;
          }
          setEditting(false);
        }}
      />
      <div
        css={css`
          clear: both;
        `}
      />
      <WorkflowGraph editing={isEditMode} actions={actions} rootId={1} />
    </React.Fragment>
  );
};

storiesOf("WorkflowGraph", module)
  .add("View Mode", () => <WorkflowGraph actions={actions} rootId={1} />)
  .add("Edit Mode", () => {
    return <EditMode />;
  });
