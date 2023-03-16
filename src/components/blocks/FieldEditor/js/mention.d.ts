export interface JSMentionPlugin {
  createMentionPlugin: any;
  defaultSuggestionsFilter: any;
}

declare const jsMentionPlugin: JSMentionPlugin;

export default jsMentionPlugin;
