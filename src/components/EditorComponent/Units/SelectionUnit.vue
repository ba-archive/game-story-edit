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
    if (!currentStoryUnit.value.selectionGroups) {
      currentStoryUnit.value.selectionGroups = [];
    }
    currentStoryUnit.value.selectionGroups = newValue;
  },
});

function handleSelectionGroupUpdate(newValue: SelectionGroup) {
  const selectionGroupsValue = selectionGroups.value;
  const index = selectionGroupsValue.findIndex(
    selectionGroup => selectionGroup.id === newValue.id
  );
  if (-1 === index) {
    selectionGroupsValue.push(newValue);
  } else {
    selectionGroupsValue[index] = newValue;
  }
  selectionGroups.value = selectionGroupsValue;
}
</script>

<template>
  <a-space direction="vertical" size="medium" fill>
    <option-unit
      v-for="selectionGroup in selectionGroups"
      :key="selectionGroup.id"
      :uuid="props.uuid"
      :selectionGroup="selectionGroup"
      @update-value="handleSelectionGroupUpdate"
    />
  </a-space>
</template>

<style scoped lang="scss"></style>
