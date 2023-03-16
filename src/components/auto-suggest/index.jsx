import React, { Component } from "react";
import PropTypes from "prop-types";

import { Input } from "element-react";

import SuggestItem from "./suggest-item";

import ss from "classnames";
import c from "./auto-suggest.comp.scss";

export default class AutoSuggest extends Component {
  static propTypes = {
    onSelect: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  state = {
    inputVal: ""
  };

  updateInputVal = val => this.setState(state => ({ ...state, inputVal: val }));

  selectAndClear = item => {
    this.updateInputVal("");
    return this.props.onSelect(item);
  };

  render = () => {
    // props, state shortcuts
    const p = this.props;
    const s = this.state;

    return (
      <div className={ss(c["container"])}>
        <Input
          placeholder={p.placeHolder}
          value={s.inputVal}
          onChange={this.updateInputVal}
        />
        <div className={ss(c["suggests"])}>
          <div className={ss(c["selectable"])}>
            {p.suggestions.map((suggest, id) =>
              p.filterFunc(s.inputVal, suggest) ? (
                <SuggestItem
                  onSelect={this.selectAndClear}
                  key={id}
                  item={suggest}
                />
              ) : null
            )}
          </div>
          {p.onAdd && <SuggestItem onAdd={p.onAdd} newSuggest={s.inputVal} />}
        </div>
      </div>
    );
  };
}

AutoSuggest.defaultProps = {
  suggestions: [
    {
      value: "no data"
    }
  ],
  filterFunc: (val, suggest) => {
    console.log(val, suggest, "is ok");
    return true;
  }
};
