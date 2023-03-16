// KEEPING THE FILE COMMENTED UNTIL DISPLAYING BUG OF STORYBOOK RESOLVED TO PROCTECTING OTHER .STORIES FILES
// import React from "react";
// import { Form } from "element-react";
// import { storiesOf } from "@storybook/react";
// import NodeDetail from "./index";
// import TimePoint from "./TriggerTimePoint";

// storiesOf("NodeDetail", module)
//   .add("Default", () => (
//     <NodeDetail
//       visible
//       triggerIdx={0}
//       action={{
//         id: 8,
//         workflowID: 1,
//         actionType: "Branch",
//         acceptActionID: 11,
//         rejectActionID: undefined,
//         triggerQuantifier: "All",
//         triggers: [
//           {
//             triggerData: {
//               timePoint: "2019-05-21T13:15:56Z"
//             },
//             triggerType: "TimePoint"
//           },
//           {
//             triggerData: {
//               Duration: "2h15m0s",
//               ParamName: "hook"
//             },
//             triggerType: "TimeAfter"
//           }
//         ],
//         actionData: {
//           System_BranchData: {
//             op: "<",
//             val: "2019-03-28T11:39:43+07:00",
//             var: "a"
//           }
//         },
//         createdAt: "1982-12-19T13:15:56Z",
//         deletedAt: "2000-02-15T10:05:11Z",
//         updatedAt: "1984-04-07T06:26:29Z"
//       }}
//     />
//   ))
//   .add("TimePoint", () => (
//     <Form labelPosition="top">
//       <TimePoint value="2142134" onChange={val => console.log(val)} />
//     </Form>
//   ));
