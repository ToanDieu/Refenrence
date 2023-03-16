import React from "react";
import { storiesOf } from "@storybook/react";
import { css } from "@emotion/core";
import { ArcherElement, ArcherContainer } from "react-archer";

import TreeList from "./index";

const data = [
  {
    id: "A",
    children: [
      {
        id: "B",
        children: [{ id: "D", children: [] }, { id: "E", children: [] }]
      },
      { id: "C", children: [{ id: "F", children: [] }] }
    ]
  }
];

storiesOf("TreeList", module)
  .add("Default", () => (
    <TreeList
      data={data}
      renderFunc={item => (
        <div
          css={css`
            text-align: center;
          `}
        >
          {item.id}
        </div>
      )}
    />
  ))
  .add("Customized", () => {
    const color = "#1ea7fd";
    const renderFunc = item => (
      <div
        css={css`
          width: 100px;
          margin: auto;
          color: #fff;
        `}
      >
        <div
          css={css`
            background-color: ${color};
            padding: 15px 30px;
            margin: 0 15px;
          `}
        >
          {item.id}
        </div>
      </div>
    );
    return (
      <TreeList
        data={data}
        edgeLength={30}
        edgeThick={4}
        edgeColor={color}
        renderFunc={renderFunc}
      />
    );
  })
  .add("With connectors", () => {
    const color = "#1ea7fd";
    const renderFunc = item => (
      <div
        css={css`
          width: 100px;
          margin: auto;
          color: #fff;
        `}
      >
        <ArcherElement
          id={item.id}
          relations={
            item.id !== "C"
              ? []
              : [
                  {
                    targetId: "E",
                    sourceAnchor: "bottom",
                    targetAnchor: "top",
                    style: { strokeColor: "red", strokeWidth: 4 }
                  }
                ]
          }
        >
          <div
            css={css`
              background-color: ${color};
              padding: 15px 30px;
              margin: 0 15px;
            `}
          >
            {item.id}
          </div>
        </ArcherElement>
      </div>
    );
    return (
      <ArcherContainer arrowThickness={5} arrowLength={5}>
        <TreeList
          data={data}
          edgeLength={50}
          edgeThick={4}
          edgeColor={color}
          renderFunc={renderFunc}
        />
      </ArcherContainer>
    );
  });
