import React from "react";
import { map, addIndex } from "ramda";

const mapIndexed = addIndex(map);

export interface ListProps<T> {
  data: T[];
  keyField?: string;
  childrenField?: string;
  renderFunc: (item: T, index: number) => React.ReactNode;
}

function List<T>(props: ListProps<T>): JSX.Element {
  const {
    data,
    keyField = "id",
    childrenField = "children",
    renderFunc
  } = props;

  const listProps = {
    keyField,
    childrenField,
    renderFunc
  };

  return (
    <ul>
      {mapIndexed((item, index) => {
        const genericItem = item as any;
        // Cast Ramda item type of mapIndexed callback to any
        const { [keyField]: key, [childrenField]: children } = item as any;
        return (
          <li key={key}>
            {renderFunc(genericItem, index)}
            {children.length > 0 && <List data={children} {...listProps} />}
          </li>
        );
      }, data)}
    </ul>
  );
}

export default List;
