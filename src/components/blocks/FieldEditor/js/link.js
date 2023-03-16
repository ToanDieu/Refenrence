import { RichUtils, EditorState } from "draft-js";
import LinkDisplay from "../link-display";

const linkStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(range => {
    const entityKey = range.getEntity();

    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

export const addLink = linkVal => (
  command,
  editorState,
  { setEditorState }
) => {
  if (command !== "handle-add-link") {
    return "not-handled";
  }

  const link = linkVal;
  const selection = editorState.getSelection();

  if (!link) {
    setEditorState(RichUtils.toggleLink(editorState, selection, null));
    return "handled";
  }

  const content = editorState.getCurrentContent();
  const contentWithLinkEntity = content.createEntity("LINK", "MUTABLE", {
    url: link,
    href: link
  });

  const newEditorState = EditorState.push(
    editorState,
    contentWithLinkEntity,
    "apply-entity"
  );

  const entityKey = contentWithLinkEntity.getLastCreatedEntityKey();
  setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey));

  return "handled";
};

// eslint-disable-next-line import/prefer-default-export
const linkPlugin = {
  // keyBindingFn(event, { getEditorState }) {
  //   const editorState = getEditorState();
  //   const selection = editorState.getSelection();
  //   if (selection.isCollapsed()) {
  //     return "";
  //   }
  //   if (KeyBindingUtil.hasCommandModifier(event) && event.which === 75) {
  //     return "handle-add-link";
  //   }
  //   return "";
  // },
  // handleKeyCommand: handleAddLink(linkProvider()),
  decorators: [
    {
      strategy: linkStrategy,
      component: LinkDisplay
    }
  ]
};

export default {
  linkPluginInstance: linkPlugin
};
