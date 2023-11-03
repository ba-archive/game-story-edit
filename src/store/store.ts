import { defineStore } from 'pinia';

export const useGameStoryEditorStore = defineStore({
  id: 'game-story-editor-store',
  persist: true,
  state: () => {
    return {
      stories: [],
    };
  },
  getters: {
    
  },
  actions: {
    
  },
});
