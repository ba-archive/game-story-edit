import mitt from "mitt";

export type Events = {
  undo: void;
  redo: void;
  save: void;
};

export const events = mitt<Events>();
