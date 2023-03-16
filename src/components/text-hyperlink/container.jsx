import { default as React, createRef } from "react";

import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import LightRange from "@/libs/lightrange";

import TextHyperLink from "./index";

export default class TextHyperlinkContainer extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    isModified: PropTypes.bool
  };
  state = {
    text: "",
    positions: {},
    selection: {
      start: 0,
      end: 0
    },
    childIndex: undefined,
    selectedText: "",
    selectedLink: "",
    editorDisplay: false,
    isInserting: true,
    isValid: false
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.text !== nextProps.text) {
      this.setState({
        text: nextProps.text
      });
    }
  }

  componentDidMount() {
    this.setState(
      {
        text: this.props.text
      },
      this.textDetection
    );
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldState.text !== this.state.text) {
      this.textDetection();
    }
  }

  selector = new LightRange();

  textArea = createRef();

  textRects = [];

  textDetection = () => {
    // getting selection positions
    const {
      xStart = 0,
      xEnd = 0,
      yStart = 0,
      charStart = 0,
      charEnd = 0,
      text = ""
    } = this.selector.getSelectionInfo();

    // getting root element positions
    const { left, top } = findDOMNode(this).getBoundingClientRect();

    const tempRects = [];
    Array.from(this.textArea.current.childNodes).forEach((node, index) => {
      if (node.nodeName === "#text") {
        const textRange = document.createRange();
        textRange.selectNodeContents(node);
        const rects = textRange.getClientRects();

        rects[0]
          ? tempRects.push({
              textIndex: index,
              end: rects[0].x + rects[0].width,
              height: rects[rects.length - 1].y
            })
          : null;
      }

      node.onclick = e => {
        e.preventDefault();
        if (node.nodeName === "A") {
          this.setState({
            childIndex: index,
            selectedText: node.innerText,
            selectedLink: node.href,
            editorDisplay: node.innerText ? true : false,
            isInserting: node.href ? false : true,
            isValid: node.href ? true : false
          });
        }
      };
    });

    this.textRects = tempRects;
    this.setState({
      positions: {
        xStart,
        xEnd,
        yStart,
        left,
        top
      },
      selection: {
        start: charStart,
        end: charEnd
      },
      childIndex: undefined,
      selectedText: text,
      selectedLink: "",
      editorDisplay: !this.selector.isContainAtag() && text ? true : false,
      isInserting: true,
      isValid: false
    });
  };

  //INSERT AND EDIT
  createOrReplaceLink = aTagMeta => {
    if (this.state.childIndex === undefined) {
      const textNodeMeta = this.textRects.find(
        rect =>
          rect.end > this.state.positions.xStart &&
          rect.height >= this.state.positions.yStart
      );

      const values = Array.from(this.textArea.current.childNodes).map(
        (node, index) => {
          if (index !== textNodeMeta.textIndex) {
            if (node.nodeName === "#text") {
              return node.nodeValue;
            } else {
              return node.outerHTML;
            }
          } else {
            const textNode = this.textArea.current.childNodes[
              textNodeMeta.textIndex
            ];

            const currentTextValue = textNode.nodeValue;

            const pre = currentTextValue.slice(0, this.state.selection.start);
            const post = currentTextValue.slice(this.state.selection.end);
            const newText = `${pre}<a href="${aTagMeta.link}">${
              aTagMeta.content
            }</a>${post}`;

            return newText;
          }
        }
      );

      this.setState(
        { text: values.join(""), selectedText: "", isValid: false },
        () => {
          this.textDetection();
          this.props.onChange(values.join(""));
        }
      );
    } else {
      const aTagNode = this.textArea.current.childNodes[this.state.childIndex];
      aTagNode.href = aTagMeta.link;

      aTagNode.innerText = aTagMeta.content;

      this.setState(
        {
          text: this.textArea.current.innerHTML,
          selectedText: "",
          childIndex: undefined,
          isValid: false
        },
        () => {
          this.textDetection();
          this.props.onChange(this.textArea.current.innerHTML);
        }
      );
    }
  };

  //CLOSE
  closeEditor = () => {
    this.setState({
      editorDisplay: false
    });
  };
  //REMOVE LINK
  removeLink = () => {
    const values = Array.from(this.textArea.current.childNodes).map(
      (node, index) => {
        if (index === this.state.childIndex) {
          return node.textContent;
        } else {
          if (node.nodeName === "#text") {
            return node.nodeValue;
          } else {
            return node.outerHTML;
          }
        }
      }
    );
    this.setState(
      { text: values.join(""), selectedText: "", isValid: false },
      () => {
        this.textDetection();
        this.props.onChange(values.join(""));
      }
    );
    this.closeEditor();
  };

  onChange = e => {
    this.setState({ text: e.target.value.replace(/&nbsp;/g, " ") }, () =>
      this.props.onChange(this.state.text)
    );
  };

  render() {
    const {
      positions,
      selectedText,
      text,
      selectedLink,
      editorDisplay,
      isInserting,
      isValid
    } = this.state;
    return (
      <TextHyperLink
        isValid={isValid}
        removeLink={this.removeLink}
        closeEditor={this.closeEditor}
        createOrReplaceLink={this.createOrReplaceLink}
        onChange={this.onChange}
        textDetection={this.textDetection}
        selectedText={selectedText}
        text={text}
        positions={positions}
        selectedLink={selectedLink}
        editorDisplay={editorDisplay}
        isInserting={isInserting}
        ref={this.textArea}
      />
    );
  }
}
