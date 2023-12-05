import mitt from "mitt";

export type Events = {
  "sync-list": void;
  "story-changed": string;
};

export const eventSystem = mitt<Events>();
