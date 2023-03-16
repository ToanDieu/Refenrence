import React, { Component, createRef } from "react";
import propTypes from "prop-types";

import ss from "classnames";
import c from "./search-popover.comp.scss";

import searchIcon from "../../assets/icons/ic-search.svg";

export default class SearchBar extends Component {
  static propTypes = {
    onEnter: propTypes.func,
    placeHolder: propTypes.string
  };

  state = {
    // popover states
    isClickedButton: false
  };

  // children ref
  inputElement = createRef();

  togglePopContent = () => {
    this.setState(state => ({
      ...state,
      isClickedButton: !state.isClickedButton
    }));
  };

  onEnter = event => {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
      this.props.onEnter(this.inputElement.current.value);
    }
  };

  render = () => (
    <div className={ss(c["container"])}>
      <img
        className={ss(c["button"])}
        onClick={this.togglePopContent}
        src={searchIcon}
      />
      <div
        className={ss(c["pop-content"], {
          [c["pop-content--active"]]: this.state.isClickedButton
        })}
      >
        {/**
         * This component and states belong to it should place here
         * as {props.children} to reuse popover component
         **/}
        <input
          className={c["content__children"]}
          ref={this.inputElement}
          type="search"
          onKeyDown={this.onEnter}
          value={this.state.inputVal}
          placeholder={this.props.placeHolder}
          required
        />
      </div>
    </div>
  );
}
