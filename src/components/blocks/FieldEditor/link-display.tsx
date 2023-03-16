import * as React from "react";
import * as Draft from "draft-js";

export interface LinkDisplayProps {
  entityKey: string;
  offsetKey: string;
  contentState: Draft.ContentState;
  getEditorState: () => Draft.EditorState;
  setEditorState: (state: Draft.EditorState) => void;
}

type EntityData = {
  url?: string;
  href?: string;
};

const LinkDisplay: React.FunctionComponent<LinkDisplayProps> = ({
  children,
  entityKey,
  contentState,
  getEditorState,
  setEditorState
}) => {
  const { url }: EntityData = contentState.getEntity(entityKey).getData();

  const handleSelect = (event: React.MouseEvent) => {
    event.preventDefault();

    const editorState = getEditorState();
    const selection = editorState.getSelection();
    const contentBlock = contentState.getBlockForKey(selection.getStartKey());

    contentBlock.findEntityRanges(
      range => range.getEntity() === entityKey,
      (start, end) => {
        const blockKey = contentBlock.getKey();

        const linkSelection = new Draft.SelectionState({
          anchorKey: blockKey,
          anchorOffset: start,
          focusKey: blockKey,
          focusOffset: end
        });

        setEditorState(
          Draft.EditorState.forceSelection(editorState, linkSelection)
        );
      }
    );
  };

  return (
    <a onClick={handleSelect} href={url}>
      {children}
    </a>
  );
};

export default LinkDisplay;
