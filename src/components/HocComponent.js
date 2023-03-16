import React from "react";
import PropTypes from "prop-types";

import { isContainScope } from "../actions/utils";

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}

export class ProtectedScopedComponent extends React.Component {
  static propTypes = {
    scopes: PropTypes.array,
    manual: PropTypes.bool
  };

  static defaultProps = {
    scopes: [],
    manual: false
  };

  isValidScope = () => {
    const { scopes } = this.props;

    let havingScope = false;
    let matchs = [];
    scopes.forEach(scope => {
      if (isContainScope(scope)) {
        havingScope = true;
        matchs = [...matchs, scope];
      }
    });

    return { havingScope, matchs };
  };

  render() {
    const { havingScope, matchs } = this.isValidScope();
    const { children, manual } = this.props;

    if (manual && isFunction(children)) {
      return children({ havingScope, matchs });
    }

    if (havingScope) {
      if (isFunction(children)) {
        return children({ matchs });
      }

      return children;
    }

    return null;
  }
}
