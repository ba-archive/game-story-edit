import { defineStore } from "pinia";
import { Story, StoryEditorTextUnit } from "@/types/GameStoryEditor";
import { v4 as uuidv4 } from "uuid";

export const useGameStoryEditorStore = defineStore({
  id: "game-story-editor-useStore",
  persist: true,
  state: () => {
    return {
      stories: [] as Story[],
    };
  },
  getters: {
    getStoryList: state =>
      state.stories.map(story => {
        return {
          serial: story.serial,
          uuid: story.uuid,
          description: story.description,
        };
      }),
    getStoryByUuid: state => (uuid: string) =>
      state.stories.find(story => uuid === story.uuid),
  },
  actions: {
    createNewStory(serial: string, description: string) {
      const uuid = uuidv4();
      this.stories.push({
        serial: serial,
        uuid: uuid,
        description: description,
        content: [] as StoryEditorTextUnit[],
      });
      return uuid;
    },
    deleteStory(uuid: string) {
      const index = this.stories.findIndex(story => uuid === story.uuid);
      if (index > -1) {
        this.stories.splice(index, 1);
      }
    },
    updateStoryMeta(uuid: string, serial: string, description: string) {
      const story = this.stories.find(story => uuid === story.uuid);
      if (story) {
        story.serial = serial;
        story.description = description;
      }
    },
    addNewStoryUnit(uuid: string, unit: StoryEditorTextUnit) {
      const story = this.stories.find(story => uuid === story.uuid);
      if (story) {
        story.content.push(unit);
      }
    },
    deleteStoryUnit(uuid: string, id: number) {
      const story = this.stories.find(story => uuid === story.uuid);
      if (story) {
        const targetIndex = story.content.findIndex(unit => id === unit.id);
        if (targetIndex > -1) {
          story.content.splice(targetIndex, 1);
        }
      }
    },
  },
});
