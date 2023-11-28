<script setup lang="ts">
import { computed } from "vue";
import { StoryEditorTextUnit } from "@/types/GameStoryEditor.ts";
import { getShanghaiDate } from "@/helper/date.ts";

const props = withDefaults(
  defineProps<{
    uuid: string;
    storyUnit: StoryEditorTextUnit;
  }>(),
  {
    uuid: "",
    storyUnit: {
      // @ts-ignore
      id: getShanghaiDate().valueOf(),
      type: "title",
      backgroundImage: "",
      bgm: "",
      text: "",
    },
  }
);

const emit = defineEmits<{
  (event: "value-change", value: StoryEditorTextUnit): void;
}>();

const currentStoryUnit = computed({
  get: () => props.storyUnit,
  set: newValue => {
    emit("value-change", newValue);
  },
});

const text = computed({
  get: () => currentStoryUnit.value?.text || "",
  set: newValue => {
    currentStoryUnit.value.text = newValue;
  },
});
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
