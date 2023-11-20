<script setup lang="ts">
import { computed } from "vue";
import { StoryEditorTextUnit } from "@/types/GameStoryEditor.ts";

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

const commandArgs = computed({
  get: () => ((currentStoryUnit.value.commandArgs || [])[0] || 0) as number,
  set: newValue => {
    currentStoryUnit.value.commandArgs = newValue ? [newValue] : [0];
  },
});
</script>

<template>
  <div class="flex gap-4 w-full justify-between">
    <div class="flex flex-col gap-2 flex-1">
      <h1>文本</h1>
      <a-textarea
        allow-clear
        placeholder="浮动文本"
        v-model="currentStoryUnit.text"
        :max-length="{ length: 400, errorOnly: true }"
        show-word-limit
        auto-size
      />
    </div>
    <a-space direction="vertical" size="small">
      <h1>文字出现间隔</h1>
      <a-space size="small">
        <a-input-number
          :min="0"
          :step="50"
          allow-clear
          v-model="commandArgs"
          style="width: 80px"
        />
        <span>毫秒</span>
      </a-space>
    </a-space>
  </div>
</template>

<style scoped lang="scss"></style>
