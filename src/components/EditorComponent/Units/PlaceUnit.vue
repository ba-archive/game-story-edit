<script setup lang="ts">
import { ref, watch } from "vue";
import { useGameStoryEditorStore } from "@/store/store.ts";
import { StoryEditorTextUnit } from "@/types/GameStoryEditor.ts";

const useStore = useGameStoryEditorStore();

const props = withDefaults(
  defineProps<{
    uuid: string;
    storyUnit: StoryEditorTextUnit;
  }>(),
  {
    uuid: "",
    storyUnit: {
      id: Date.now().valueOf(),
      type: "title",
      backgroundImage: "",
      bgm: "",
      text: "",
    },
  }
);

const currentStoryUnit = ref(props.storyUnit);

const text = ref(currentStoryUnit.value?.text || "");

watch(
  () => text.value,
  () => {
    currentStoryUnit.value.text = text.value ? text.value : "placeholder";
  }
);

watch(
  () => currentStoryUnit.value,
  () => {
    useStore.updateStoryUnit(
      props.uuid,
      currentStoryUnit.value.id,
      currentStoryUnit.value
    );
  }
);
</script>

<template>
  <a-space direction="vertical" size="small" fill>
    <h1>地点</h1>
    <a-input
      allow-clear
      placeholder="地点会显示在剧情窗口左上角"
      v-model="text"
    />
  </a-space>
</template>

<style scoped lang="scss"></style>
