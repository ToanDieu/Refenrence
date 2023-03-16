import React, { useState, useEffect } from "react";
import Draft, { EditorState } from "draft-js";
import { css } from "@emotion/core";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import san from "sanitize-html";

import jsToolbar from "./js/toolbar";
import jsMention from "./js/mention";
import jsLinkPlugin from "./js/link";
import PluginsEditor from "./js/editor";

import LinkInput from "./link-input";

import "draft-js-mention-plugin/lib/plugin.css";

export type SuggestItem = {
  name: string;
};

export interface FieldEditorProps {
  data: string;
  dirty?: boolean;
  exports?: (name: string, method: any) => void;
  onChange: (data: string) => void;
  hyperLink: boolean;
  mention: boolean;
  suggestions: SuggestItem[];
  className?: string;
}

const turnNewlineToBrHelper = (data: string) => {
  return data.replace(new RegExp(/\r?\n/, "g"), "<br />");
};

const FieldEditor: React.FunctionComponent<FieldEditorProps> = props => {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const pluginEditorRef = React.useRef<PluginsEditor>(null);

  const [editorState, setEditorState] = useState<Draft.EditorState>(() => {
    /**
     * editor value will be transform \n or \r\n signal as html <br /> html tag
     */
    const data = props.data ? turnNewlineToBrHelper(props.data) : props.data;
    const contentState = stateFromHTML(data);

    return EditorState.push(
      EditorState.createEmpty(),
      contentState,
      undefined as any
    );
  });

  const [decorator, setDecorator] = useState<
    Draft.CompositeDecorator | undefined
  >(undefined);

  const [suggests, setSuggests] = useState<SuggestItem[]>(props.suggestions);

  const [{ plugins = [], Mention, Toolbar }] = useState(() => {
    const toolbarPlugInstance = jsToolbar.createToolbarPlugin();
    const mentionPlugInstance = jsMention.createMentionPlugin({
      entityMutability: "MUTABLE",
      mentionTrigger: "{{"
    });

    const tempPlugins = [];
    if (props.hyperLink) {
      tempPlugins.push(toolbarPlugInstance);
      tempPlugins.push(jsLinkPlugin.linkPluginInstance);
    }
    if (props.mention) {
      tempPlugins.push(mentionPlugInstance);
    }

    return {
      plugins: tempPlugins,
      Mention: mentionPlugInstance.MentionSuggestions,
      Toolbar: toolbarPlugInstance.InlineToolbar
    };
  });

  const getCurrentEditState = React.useCallback(() => {
    return editorState;
  }, [editorState]);

  useEffect(() => {
    return () => {
      if (props.exports) {
        props.exports("reloadData", () => {});
      }
    };
  }, []);

  const reloadData = React.useCallback(() => {
    // const contentState = parseMentions(stateFromHTML(props.data));
    const data = props.data ? turnNewlineToBrHelper(props.data) : props.data;
    const contentState = stateFromHTML(data);

    if (decorator) {
      // console.log("decorator pluged");
      const state = getCurrentEditState();

      // console.log(state.getSelection().toJS());
      const stateWithNewContent = EditorState.push(
        state,
        contentState,
        "change-block-data"
      );

      setEditorState(stateWithNewContent);
    }
  }, [props.data]);

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOuside, false);
    return () => {
      document.removeEventListener("mousedown", handleClickOuside, false);
    };
  }, [editorState]);

  const handleChangeEditorState = (state: Draft.EditorState) => {
    const contentState = state.getCurrentContent();
    // const html = stateToHTML(contentState, { defaultBlockTag: null } as any);
    const html = stateToHTML(contentState);
    /**
     * sanitizer will remove <br /> and leave \n alone
     */
    const htmlAfterSan = san(html, {
      allowedTags: ["a"],
      allowedAttributes: {
        a: ["href"]
      }
    });
    // console.log("HTML:\n", html, "\n\nHTML after san:\n", htmlAfterSan);
    props.onChange(htmlAfterSan.split("&amp;").join("&"));

    setEditorState(state);
  };

  const suggestsFilter = (
    searchValue: string,
    suggestions: { name: string }[]
  ) => {
    const value = searchValue.toLowerCase();
    const filteredSuggestions = suggestions.filter(
      suggestion => !value || suggestion.name.toLowerCase().indexOf(value) > -1
    );
    const length =
      filteredSuggestions.length < 20 ? filteredSuggestions.length : 20;
    return filteredSuggestions.slice(0, length);
  };

  const handleMentionsSearch = ({ value }: { value: any }) => {
    setSuggests(suggestsFilter(value, props.suggestions));
  };

  const handleClickOuside = (event: Event) => {
    if (editorRef.current && event.target) {
      if (editorRef.current.contains(event.target as Node)) {
        return;
      }
      setEditorState(Draft.EditorState.moveSelectionToEnd(editorState));
    }
  };

  const handleClickContainer = () => {
    // console.log("clicked container");
    if (pluginEditorRef.current) {
      pluginEditorRef.current.focus();
    }
  };

  if (props.exports) {
    props.exports("reloadData", reloadData);
  }

  return (
    <div
      role="presentation"
      ref={editorRef}
      onClick={handleClickContainer}
      css={container({ dirty: props.dirty })}
      className={props.className}
    >
      <PluginsEditor
        ref={pluginEditorRef}
        plugins={plugins}
        editorState={editorState}
        onChange={handleChangeEditorState}
        onSetDecorator={(dec: Draft.CompositeDecorator) => {
          if (!decorator) setDecorator(dec);
        }}
      />
      {props.mention && (
        <Mention onSearchChange={handleMentionsSearch} suggestions={suggests} />
      )}
      {props.hyperLink && (
        <Toolbar>
          {(toolbarProps: any) => (
            <React.Fragment>
              <LinkInput {...toolbarProps} />
            </React.Fragment>
          )}
        </Toolbar>
      )}
    </div>
  );
};

FieldEditor.defaultProps = {
  hyperLink: true,
  mention: true
};

const container = ({ dirty }: { dirty?: boolean }) => css`
  margin-top: 10px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  padding: 0 1em;
  min-height: 50px;

  cursor: text;
  background-color: ${dirty ? "#f6f5f4" : "white"};
  border: 1px solid #b2b2b2;

  .DraftEditor-root {
    margin: 10px 0;
    width: 100%;
    color: #7f7f7f;
  }

  span[class^="draftJsMentionPlugin__mention"] {
    color: #7f7f7f;
    background: none;
    cursor: text;
  }
`;

export default FieldEditor;
