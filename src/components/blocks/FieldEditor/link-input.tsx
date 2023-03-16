import * as React from "react";
import * as Draft from "draft-js";
import { css } from "@emotion/core";

// eslint-disable-next-line import/named
import { addLink, EditorStateMutator } from "./js/link";
import jsUtils from "./js/utils";

const { useState, useEffect } = React;

interface LinkInputProps extends EditorStateMutator {}

const LinkInput: React.FunctionComponent<LinkInputProps> = ({
  getEditorState,
  setEditorState
}) => {
  const linkInputRef = React.useRef<HTMLDivElement>(null);
  const editorState: Draft.EditorState = getEditorState();
  const entityKey = jsUtils.getSelectionEntity(editorState);

  const [inputState, setInputState] = useState<string>("");
  const [editable, setEditStatus] = useState<Boolean>(true);
  const [editting, setEditting] = useState<Boolean>(false);

  useEffect(() => {
    if (entityKey) {
      const contentState = editorState.getCurrentContent();
      const entity = contentState.getEntity(entityKey);

      if (entity.getType() === "LINK") {
        const { url } = entity.getData();
        setEditStatus(false);
        setInputState(url);
      }
    } else {
      setEditStatus(true);
      setInputState("");
    }
  }, [entityKey]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, false);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, false);
    };
  }, [editting, editorState]);

  const handleAddNewLink = () =>
    // event: React.MouseEvent
    {
      const before = inputState.trimLeft();
      const afterReplace = inputState
        .trimLeft()
        .replace(/^(https?:\/\/|mailto:)/, "");
      let newVal = before;
      if (before === afterReplace) {
        newVal = `http://${before}`;
      }

      addLink(newVal)("handle-add-link", getEditorState(), {
        getEditorState,
        setEditorState
      });
    };

  const handleRemoveLink = () =>
    // event: React.MouseEvent
    {
      addLink("")("handle-add-link", getEditorState(), {
        getEditorState,
        setEditorState
      });
    };

  const handleToggleEdit = () =>
    // event: React.MouseEvent
    {
      setEditStatus(true);
    };

  const handleModifyLink = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputState(event.target.value);
  };

  const handleExit = () =>
    // event?: React.MouseEvent
    {
      if (editting) {
        setEditorState(Draft.EditorState.moveSelectionToEnd(editorState));
        setEditting(false);
      }
    };

  const handleClickOutside = (event: Event) => {
    if (linkInputRef.current && event.target) {
      if (linkInputRef.current.contains(event.target as Node)) {
        setEditting(true);
        return;
      }
      // console.log("clicked outside link input field");
      handleExit();
    }
  };

  return (
    <div
      ref={linkInputRef}
      role="presentation"
      onClick={e => {
        e.stopPropagation();
      }}
      css={container}
    >
      {editable ? (
        <React.Fragment>
          <input
            placeholder="Enter you link"
            css={field(true)}
            value={inputState}
            onChange={handleModifyLink}
            type="text"
          />
          <i
            role="presentation"
            css={icon}
            onClick={handleAddNewLink}
            className="icon-checkbox-fill"
          />
          <i
            role="presentation"
            css={icon}
            onClick={handleExit}
            className="icon-cancel-fill"
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <a
            target="_blank"
            rel="noopener noreferrer"
            css={field(false)}
            href={inputState}
          >
            {inputState}
          </a>
          <i
            role="presentation"
            css={icon}
            onClick={handleToggleEdit}
            className="icon-edit-fill"
          />
          <i
            role="presentation"
            css={icon}
            onClick={handleRemoveLink}
            className="icon-trash-fill"
          />
        </React.Fragment>
      )}
    </div>
  );
};

const container = css`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 300px;

  padding: 3px 3px 3px 5px;
`;

const icon = css`
  margin-right: 3px;
  :last-child {
    margin-right: 0px;
  }

  cursor: default;
  font-size: 25px;
  color: #1d5a6e;
`;

const field = (input: Boolean) => css`
  display: inline-block;
  margin-right: 3px;

  ${input ? "padding-bottom: 2px;" : ""}
  width: 100%;
  max-width: 250px;

  overflow: hidden;
  height: 1em;
  font-size: 15px;
  border: none;
  :focus {
    outline: none;
  }
`;

export default LinkInput;
