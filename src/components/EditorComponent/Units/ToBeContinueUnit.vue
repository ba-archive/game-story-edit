<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useGameStoryEditorStore } from "@/store/store.ts";
import { StoryEditorTextUnit } from "@/types/GameStoryEditor.ts";
const useStore = useGameStoryEditorStore();

const props = defineProps<{
  uuid: string;
  storyUnit: StoryEditorTextUnit;
}>();

const emit = defineEmits<{
  (event: "value-change", value: StoryEditorTextUnit): void;
}>();

const currentStoryUnit = computed({
  get: () => props.storyUnit,
  set: newValue => {
    emit("value-change", newValue);
  },
});

const showNextEpisode = ref(0 !== currentStoryUnit.value?.text?.length);

watch(
  () => showNextEpisode.value,
  newValue => {
    if (!newValue) {
      currentStoryUnit.value.text = "";
    }
  }
);
</script>

<template>
  <a-space direction="vertical" size="small" fill>
    <a-checkbox v-model="showNextEpisode">显示下一话标题</a-checkbox>
    <a-input
      v-if="showNextEpisode"
      allow-clear
      placeholder="下一话标题"
      v-model="currentStoryUnit.text"
    />
  </a-space>
</template>

<style scoped lang="scss"></style>
