import { default as React } from "react";

import PropTypes from "prop-types";
import Box from "ui-box";

import ContentEditable from "react-contenteditable";
import Editor from "./editor";

import ss from "classnames";
import c from "./text-hyperlink.comp.scss";

class TextHyperlink extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    isModified: PropTypes.bool,
    textDetection: PropTypes.func,
    createOrReplaceLink: PropTypes.func,
    closeEditor: PropTypes.func,
    removeLink: PropTypes.func,
    positions: PropTypes.object,
    selectedText: PropTypes.string,
    selectedLink: PropTypes.string,
    editorDisplay: PropTypes.bool,
    isInserting: PropTypes.bool,
    textArea: PropTypes.any,
    isValid: PropTypes.bool
  };

  textDetection = e => {
    if (e) {
      e.target.blur();
      e.target.focus();
    }
    this.props.textDetection();
  };
  //INSERT AND EDIT
  createOrReplaceLink = aTagMeta => {
    this.props.createOrReplaceLink(aTagMeta);
  };
  //CLOSE
  closeEditor = () => {
    this.props.closeEditor();
  };
  //REMOVE LINK
  removeLink = () => {
    this.props.removeLink();
  };

  onChange = e => {
    this.props.onChange(e);
  };

  render() {
    const { xStart, xEnd, yStart, top, left } = this.props.positions;
    const topPosition = `${yStart - top - 39}px`;
    const startPadding = xStart - left;
    const endPadding = xEnd - left;
    const leftPosition = `${(startPadding + endPadding) / 2 + 23}px`;
    const {
      text,
      selectedText,
      selectedLink,
      editorDisplay,
      isInserting,
      disabled,
      isModified,
      isValid
    } = this.props;
    return (
      <div>
        <div className={ss(c["container"])}>
          {editorDisplay ? (
            <Box
              top={topPosition}
              position="absolute"
              left={leftPosition}
              transform="translateX(-50%)"
              display="block"
            >
              <Editor
                text={selectedText}
                initialLink={selectedLink}
                createOrReplaceLink={this.createOrReplaceLink}
                closeEditor={this.closeEditor}
                removeLink={this.removeLink}
                isInserting={isInserting}
                isValid={isValid}
              />
            </Box>
          ) : null}

          <ContentEditable
            innerRef={this.props.textArea}
            html={text}
            disabled={disabled}
            onMouseUp={this.textDetection}
            onChange={e => this.onChange(e)}
            tagName="article"
          />
        </div>
        {isModified && (
          <span className="u-color--dark-blue u-margin-left--7 u-font-size--12">
            modified
          </span>
        )}
      </div>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <TextHyperlink textArea={ref} {...props} />
));
