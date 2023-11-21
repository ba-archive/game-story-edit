<script setup lang="ts">
import { computed } from "vue";
import {
  SelectionGroup,
  StoryEditorTextUnit,
} from "@/types/GameStoryEditor.ts";
import OptionUnit from "@components/EditorComponent/Units/OptionUnit.vue";

const props = defineProps<{
  uuid: string;
  storyUnit: StoryEditorTextUnit;
}>();

const emit = defineEmits<{
  (event: "update-value", value: StoryEditorTextUnit): void;
}>();

const currentStoryUnit = computed({
  get: () => props.storyUnit,
  set: newValue => {
    emit("update-value", newValue);
  },
});

const selectionGroups = computed({
  get: () =>
    currentStoryUnit.value.selectionGroups ?? [
      {
        id: Date.now().valueOf(),
        type: "option",
        text: "",
        condition: [] as unknown as SelectionGroup["condition"],
        content: [] as StoryEditorTextUnit[],
      },
    ],
  set: newValue => {
    currentStoryUnit.value.selectionGroups = newValue;
  },
});
</script>

<template>
  <a-space direction="vertical" size="medium">
    <option-unit
      v-for="selectionGroup in selectionGroups"
      :key="selectionGroup.id"
      :uuid="props.uuid"
      :selectionGroup="selectionGroup"
    />
  </a-space>
</template>

<style scoped lang="scss"></style>
