import mitt from "mitt";

export type Events = {
  "sync-list": void;
  "story-changed": string;
  "list-sorted": unknown[];
};

export const eventSystem = mitt<Events>();
