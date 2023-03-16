// KEEPING THE FILE COMMENTED UNTIL DISPLAYING BUG OF STORYBOOK RESOLVED TO PROCTECTING OTHER .STORIES FILES
// import React from "react";
// import { storiesOf } from "@storybook/react";
// import PopupHelper, { PopupHelperCtx } from "@/helpers/PopupHelper";
// import NodeDetail from "@/components/presents/NodeDetail/index";

// const block = {
//   padding: "5px",
//   border: "1px solid black"
// };

// const SomePage = () => {
//   const popupCtx = React.useContext(PopupHelperCtx);
//   const { visible = false } = { ...popupCtx };

//   React.useEffect(() => {
//     if (popupCtx) {
//       console.log("detected popup module");
//     } else {
//       console.log(new Error("your application not support popup module"));
//     }

//     // close popup on exit this page
//     return () => popupCtx && popupCtx.turn(false);
//   }, []);

//   const showSampleForm = () => {
//     if (popupCtx) {
//       popupCtx.setContent(() => ({
//         render: closePopup => {
//           console.log(closePopup);
//           return <PopupForm onExitForm={closePopup} />;
//         },
//         on: true
//       }));
//     }
//   };

//   return (
//     <div style={block}>
//       <div>Example Page (view your console log)</div>
//       {!visible && (
//         <button type="button" onClick={showSampleForm}>
//           show popup form
//         </button>
//       )}
//       {visible && (
//         <button type="button" onClick={() => popupCtx.turn(false)}>
//           exit popup by page
//         </button>
//       )}
//     </div>
//   );
// };

// // eslint-disable-next-line react/prop-types
// const PopupForm = ({ onExitForm }) => (
//   <div style={block}>
//     <div>Form Sample</div>
//     <button type="button" onClick={onExitForm}>
//       exit popup by popup content
//     </button>
//   </div>
// );

// // eslint-disable-next-line react/prop-types
// const Popup = ({ onClose, children }) => {
//   const customClose = () => {
//     // custom close for this component
//     onClose();
//   };

//   return (
//     <div style={block}>
//       <button type="button" onClick={customClose}>
//         exit popup by popup wrapper
//       </button>
//       <div>Popup</div>
//       {children(customClose)}
//     </div>
//   );
// };

// const WorkflowPage = () => {
//   const popupCtx = React.useContext(PopupHelperCtx);
//   const { visible = false } = { ...popupCtx };

//   React.useEffect(() => {
//     if (popupCtx) {
//       console.log("detected popup module");
//     } else {
//       console.log(new Error("your application not support popup module"));
//     }

//     // close popup on exit this page
//     return () => popupCtx && popupCtx.turn(false);
//   }, []);

//   const showSampleForm = () => {
//     if (popupCtx) {
//       popupCtx.setContent(() => ({
//         render: closePopup => {
//           console.log(closePopup);
//           return (
//             <NodeDetail
//               visible
//               onClose={closePopup}
//               triggerIdx={0}
//               action={{
//                 id: 8,
//                 workflowID: 1,
//                 actionType: "Branch",
//                 acceptActionID: 11,
//                 rejectActionID: undefined,
//                 triggerQuantifier: "All",
//                 triggers: [
//                   {
//                     triggerData: {
//                       timePoint: "1982-12-19T13:15:56Z"
//                     },
//                     triggerType: "TimePoint"
//                   },
//                   {
//                     triggerData: {
//                       Duration: "2h15m0s",
//                       ParamName: "hook"
//                     },
//                     triggerType: "TimeAfter"
//                   }
//                 ],
//                 actionData: {
//                   System_BranchData: {
//                     op: "<",
//                     val: "2019-03-28T11:39:43+07:00",
//                     var: "a"
//                   }
//                 },
//                 createdAt: "1982-12-19T13:15:56Z",
//                 deletedAt: "2000-02-15T10:05:11Z",
//                 updatedAt: "1984-04-07T06:26:29Z"
//               }}
//             />
//           );
//         },
//         on: true
//       }));
//     }
//   };

//   return (
//     <div style={block}>
//       <div>Example Page (view your console log)</div>
//       {!visible && (
//         <button type="button" onClick={showSampleForm}>
//           show popup form
//         </button>
//       )}
//       {visible && (
//         <button type="button" onClick={() => popupCtx.turn(false)}>
//           exit popup by page
//         </button>
//       )}
//     </div>
//   );
// };

// storiesOf("PopupHelper", module)
//   .addDecorator(storyFn => <div>{storyFn()}</div>)
//   .add("page with popup helper", () => (
//     <PopupHelper use={Popup}>
//       <SomePage />
//     </PopupHelper>
//   ))
//   .add("page without popup helper", () => <SomePage />)
//   .add("with dialog form", () => (
//     <PopupHelper
//       use={({ children, onClose }) => <div>{children(onClose)}</div>}
//     >
//       <WorkflowPage />
//     </PopupHelper>
//   ));
