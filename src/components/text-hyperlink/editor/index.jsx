import { default as React, Component, createRef } from "react";
import PropTypes from "prop-types";

import ss from "classnames";
import c from "./editor.comp.scss";

import IcBoxCheckPrimary from "./icons/ic-box-check-primary.svg";
import IcBoxCheck from "./icons/ic-box-check.svg";
import IcBoxCancel from "./icons/ic-box-cancel.svg";
import IcBoxEdit from "./icons/ic-box-edit.svg";
import IcBoxTrash from "./icons/ic-box-trash.svg";

import { urlRegex } from "../../../constants";

export default class Editor extends Component {
  static propTypes = {
    text: PropTypes.string,
    initialLink: PropTypes.string,
    createOrReplaceLink: PropTypes.func,
    isInserting: PropTypes.bool,
    closeEditor: PropTypes.func,
    removeLink: PropTypes.func,
    isValid: PropTypes.bool
  };

  static defaultProps = {
    createOrReplaceLink: rendered => {
      console.log("editor: ", rendered);
    },
    initialLink: "",
    isInserting: true,
    isValid: false
  };

  state = {
    inputVal: this.props.initialLink,
    isInserting: this.props.isInserting,
    editting: false,
    isValid: this.props.isValid
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.initialLink !== nextProps.initialLink) {
      this.setState({
        inputVal: nextProps.initialLink
      });
    }
    if (this.state.isInserting !== nextProps.isInserting) {
      this.setState({
        isInserting: nextProps.isInserting
      });
    }
    if (this.state.isValid !== nextProps.isValid) {
      this.setState({
        isValid: nextProps.isValid
      });
    }
  }

  inputEditorRef = createRef();

  changeInputVal = () => {
    const inputVal = this.inputEditorRef.current.value;
    const isValid = urlRegex.test(inputVal);
    this.setState(state => {
      return {
        ...state,
        inputVal: inputVal
      };
    });
    if (isValid) {
      this.setState({
        isValid: true
      });
    } else {
      this.setState({
        isValid: false
      });
    }
  };

  handleAddEdit = () => {
    const { isInserting, editting, isValid, inputVal } = this.state;
    if (isValid) {
      let returnLink = "";
      const modifier = inputVal.slice(0, 4);
      if (modifier === "http") {
        returnLink = inputVal;
      } else {
        returnLink = `http://${inputVal}`;
      }
      if (isInserting && !editting) {
        // INSERT
        this.props.createOrReplaceLink({
          content: this.props.text,
          link: returnLink
        });
      } else if (!isInserting && !editting) {
        this.setState({
          editting: true
        });
      } else if (!isInserting && editting) {
        this.setState({
          editting: false
        });
        // EDIT
        this.props.createOrReplaceLink({
          content: this.props.text,
          link: returnLink
        });
      }
    }
  };

  closePopover = () => {
    const { isInserting, editting } = this.state;
    if (!isInserting && !editting) {
      // REMOVE
      this.props.removeLink();
    } else {
      // CLOSE
      this.props.closeEditor();
    }
  };

  render() {
    const { isInserting, inputVal, isValid, editting } = this.state;
    let disabledIcon = isValid ? "" : "disabled";

    return (
      <div className={ss(c["wrapper"])}>
        <div className={ss(c["wrapper__content-triangle"])}>
          <div className={ss(c["wrapper__content-triangle__main"])}>
            {isInserting || editting ? (
              <input
                type="text"
                ref={this.inputEditorRef}
                placeholder="http(s)://example.com"
                className={ss(c["input"])}
                value={inputVal}
                onChange={this.changeInputVal}
              />
            ) : (
              <a target="_blank" href={inputVal}>
                {inputVal}
              </a>
            )}
          </div>
          <div className={ss(c["wrapper__content-triangle__shape"])} />
        </div>
        <div className={ss(c["wrapper__icons"])}>
          <img
            src={
              isInserting || editting
                ? isValid
                  ? IcBoxCheckPrimary
                  : IcBoxCheck
                : IcBoxEdit
            }
            onClick={this.handleAddEdit}
            className={ss(c[disabledIcon])}
          />
          <img
            src={isInserting || editting ? IcBoxCancel : IcBoxTrash}
            onClick={this.closePopover}
          />
        </div>
      </div>
    );
  }
}
