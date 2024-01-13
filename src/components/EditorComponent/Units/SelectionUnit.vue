<script setup lang="ts">
import { computed } from "vue";
import {
  SelectionGroup,
  StoryEditorTextUnit,
} from "@/types/GameStoryEditor.ts";
import OptionUnit from "@components/EditorComponent/Units/OptionUnit.vue";
import { getShanghaiDate } from "@/helper/date.ts";

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
        id: getShanghaiDate().valueOf(),
        type: "option",
        text: "",
        isConditional: false,
        condition: [] as unknown as SelectionGroup["condition"],
        content: [] as StoryEditorTextUnit[],
        script: "",
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

function handleAddNewSelectionGroup() {
  selectionGroups.value.push({
    id: getShanghaiDate().valueOf(),
    type: "option",
    text: "",
    isConditional: false,
    condition: [] as unknown as SelectionGroup["condition"],
    content: [] as StoryEditorTextUnit[],
    script: "",
  });
}

function handleRequestDeleteSelectionGroup(id: number) {
  selectionGroups.value = selectionGroups.value.filter(
    selectionGroup => selectionGroup.id !== id
  );
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
      @request-delete="handleRequestDeleteSelectionGroup"
    />
    <a-button long type="primary" @click="handleAddNewSelectionGroup">
      添加选项组
    </a-button>
  </a-space>
</template>

<style scoped lang="scss"></style>
