import React from "react";
import { TranslateFunction } from "react-localize-redux";

import { BaseMedia } from "@/resources/bases";
import { Table } from "./styles";
import Item from "./Item";

interface Props {
  bases: BaseMedia[];
  currentBaseId: number;
  renderItem: (item: BaseMedia) => React.ReactNode;
  translate: TranslateFunction;
}

function BaseList({
  bases,
  currentBaseId,
  renderItem,
  translate = () => "Translated"
}: Props) {
  const columns = [
    { key: "name", name: "Name" },
    { key: "code", name: "Code" },
    { key: "updated", name: "Updated" },
    { key: "tags", name: "tags" },
    { key: "edit", name: "" },
    { key: "workflow", name: "" }
  ];

  const defaultRenderItem = (item: BaseMedia) => (
    <Item
      key={`list-tem-${item.id}`}
      item={item}
      currentBaseId={currentBaseId}
      translate={translate}
    />
  );

  const content = bases.map((item: BaseMedia) =>
    renderItem ? renderItem(item) : defaultRenderItem(item)
  );

  return (
    <Table>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>{col.name===""?col.name:translate(col.name)}</th>
          ))}
        </tr>
      </thead>
      <tbody>{content}</tbody>
    </Table>
  );
}

export default BaseList;
