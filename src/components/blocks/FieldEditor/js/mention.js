import createMentionPlugin, {
  defaultSuggestionsFilter
} from "draft-js-mention-plugin";

// const mentionPlugInstance = createMentionPlugin({
//   entityMutability: "IMMUTABLE",
//   mentionTrigger: "{{",
// });

// eslint-disable-next-line import/prefer-default-export
// export const jsMentionPlugin = {
//   // Mention: mentionPlugInstance.MentionSuggestions,
//   createMentionPlugin,
// };

export default {
  createMentionPlugin,
  defaultSuggestionsFilter
};
