// import * as React from "react";
import * as Draft from "draft-js";

export interface JSLinkPlugin {
  linkPluginInstance: any;
}

declare const jsLinkPlugin: JSLinkPlugin;

export default jsLinkPlugin;

export interface EditorStateMutator {
  setEditorState(state: Draft.EditorState): void;
  getEditorState(): Draft.EditorState;
}

export type AddLinkClosure = (
  command: string,
  editorState: Draft.EditorState,
  { setEditorState, getEditorState }: EditorStateMutator
) => void;

export function addLink(link: string): AddLinkClosure;
