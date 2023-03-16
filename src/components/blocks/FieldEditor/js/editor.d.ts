import * as React from "react";
import * as Draft from "draft-js";

export type PluginsEditorProps =
  | Draft.EditorProps
  | {
      onSetDecorator: any;
      plugins: any;
      decorators: any;
      editor: any;
    };

export default class PluginsEditor extends React.Component<
  PluginsEditorProps,
  Draft.EditorState
> {
  focus(): any;
  getEditorState(): Draft.EditorState;
}

export function createEditorStateWithText(text: string): PluginsEditor;
export function composeDecorators(...func: any[]): (...args: any[]) => any;
