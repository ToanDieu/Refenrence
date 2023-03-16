import React from "react";

import List, { ListProps } from "./List";
import Wrapper, { WrapperProps } from "./Wrapper";

export interface Props<T> extends WrapperProps, ListProps<T> {}

function TreeList<T>({
  edgeLength,
  edgeThick,
  edgeColor,
  ...props
}: Props<T>): JSX.Element {
  return (
    <Wrapper
      edgeLength={edgeLength}
      edgeThick={edgeThick}
      edgeColor={edgeColor}
    >
      <List {...props} />
    </Wrapper>
  );
}

export default TreeList;
