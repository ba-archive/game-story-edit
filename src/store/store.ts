import { defineStore } from "pinia";
import {
  Story,
  StoryEditorTextUnit,
  StoryStatus,
} from "@/types/GameStoryEditor";
import { v4 as uuidv4 } from "uuid";
import { getShanghaiDate } from "@/helper/date.ts";
import { eventSystem } from "@/eventSystem/eventSystem.ts";

export const useGameStoryEditorStore = defineStore({
  id: "game-story-editor-useStore",
  persist: true,
  state: () => {
    return {
      stories: [] as Story[],
      remoteData: { stories: [] as Story[], lastUpdated: 0 },
    };
  },
  getters: {
    getStoryList: state =>
      state.stories.map(story => {
        return {
          serial: story.serial,
          uuid: story.uuid,
          description: story.description,
          lastUpdated: story.lastUpdated,
          tags: story.tags,
        };
      }),
    getStoryByUuid: state => (uuid: string) =>
      state.stories.find(story => uuid === story.uuid),
  },
  actions: {
    overwriteStory(story: Story, timestamp = 0) {
      const index = this.stories.findIndex(
        localStory => story.uuid === localStory.uuid
      );
      if (index > -1) {
        if (timestamp !== 0) {
          story.lastUpdated = timestamp;
        } else {
          story.lastUpdated = getShanghaiDate().valueOf();
        }
        this.stories[index] = story;
      } else {
        story.lastUpdated = getShanghaiDate().valueOf();
        this.stories.push(story);
      }
    },
    createNewStory(serial: string, description: string) {
      const uuid = uuidv4();
      this.stories.push({
        serial: serial,
        uuid: uuid,
        lastUpdated: getShanghaiDate().valueOf(),
        status: StoryStatus.working,
        description: description,
        tags: [],
        content: [] as StoryEditorTextUnit[],
      });
      eventSystem.emit("story-changed", uuid);
      return uuid;
    },
    deleteStory(uuid: string) {
      const index = this.stories.findIndex(story => uuid === story.uuid);
      if (index > -1) {
        this.stories.splice(index, 1);
      }
    },
    updateStoryMeta(
      uuid: string,
      serial: string,
      description: string,
      tags: string[]
    ) {
      const story = this.stories.find(story => uuid === story.uuid);
      if (story) {
        story.serial = serial;
        story.tags = tags;
        story.description = description;
        story.lastUpdated = getShanghaiDate().valueOf();
        eventSystem.emit("story-changed", uuid);
      }
    },
    addNewStoryUnit(
      uuid: string,
      unit: StoryEditorTextUnit,
      positionBehind: null | number = null
    ) {
      const story = this.stories.find(story => uuid === story.uuid);
      if (story) {
        story.lastUpdated = getShanghaiDate().valueOf();
        if (positionBehind === null) {
          story.content.push(unit);
          return;
        }
        const targetIndex = story.content.findIndex(
          unit => positionBehind === unit.id
        );
        if (targetIndex > -1) {
          story.content.splice(targetIndex + 1, 0, unit);
        }
        story.lastUpdated = getShanghaiDate().valueOf();
      }
    },
    deleteStoryUnit(uuid: string, id: number) {
      const story = this.stories.find(story => uuid === story.uuid);
      if (story) {
        story.lastUpdated = getShanghaiDate().valueOf();
        const targetIndex = story.content.findIndex(unit => id === unit.id);
        if (targetIndex > -1) {
          story.content.splice(targetIndex, 1);
        }
      }
    },
    updateStoryUnit(uuid: string, id: number, unit: StoryEditorTextUnit) {
      const story = this.stories.find(story => uuid === story.uuid);
      if (story) {
        story.lastUpdated = getShanghaiDate().valueOf();
        const targetIndex = story.content.findIndex(unit => id === unit.id);
        if (targetIndex > -1) {
          story.content[targetIndex] = unit;
        }
        story.lastUpdated = getShanghaiDate().valueOf();
      }
    },
    updateRemoteStories(stories: Story[]) {
      this.remoteData.stories = stories;
      this.remoteData.lastUpdated = getShanghaiDate().valueOf();
    },
  },
});
