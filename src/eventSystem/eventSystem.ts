import mitt from "mitt";

export type Events = {
  "sync-list": void;
};

export const eventSystem = mitt<Events>();
