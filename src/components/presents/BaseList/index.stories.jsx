// import React from "react";
// import { storiesOf } from "@storybook/react";
// import { BrowserRouter } from "react-router-dom";

// import { NextIcon } from "@/components/units/Icon";
// import TagPanel from "@/components/presents/TagPanel";
// import { MemoLink, ActionLink } from "./styles";
// import BaseList from "./index";

// const data = [
//   {
//     id: 1,
//     memo: "Test base 1",
//     name: "Test base 1",
//     shortcode: "ds9c",
//     style: "eventTicket",
//     timeZone: "Europe/Berlin",
//     updatedAt: "2019-04-16T08:45:31.900931Z"
//   },
//   {
//     id: 2,
//     memo: "Test base 2",
//     name: "Test base 2",
//     shortcode: "ds9c",
//     style: "eventTicket",
//     timeZone: "Europe/Berlin",
//     updatedAt: "2019-04-16T08:45:31.900931Z"
//   }
// ];

// storiesOf("BaseList", module).add("Default", () => {
//   const renderItem = item => (
//     <tr key={`list-tem-${item.id}`}>
//       <td>
//         <MemoLink to={`/bases/${item.id}/cases`}>
//           <span>{item.name}</span>
//           <h4>{item.memo}</h4>
//         </MemoLink>
//       </td>
//       <td>{item.shortcode || "not availble"}</td>
//       <td>{item.updatedAt}</td>
//       <td>
//         <TagPanel
//           baseID={item.id}
//           availableTags={[]}
//           selectedTags={item.tags || []}
//         />
//       </td>
//       <td>
//         <ActionLink className="view" to={`/bases/${item.id}`}>
//           <NextIcon name="edit" size={24} />
//         </ActionLink>
//       </td>
//       <td>
//         <ActionLink to={`/bases/${item.id}/workflows/*/actions`}>
//           <NextIcon name="workflow" size={24} />
//         </ActionLink>
//       </td>
//     </tr>
//   );

//   return (
//     <BrowserRouter>
//       <BaseList bases={data} currentBaseId={1} renderItem={renderItem} />
//     </BrowserRouter>
//   );
// });
