<script setup lang="ts">
import {
  commandList,
  StoryEditorTextUnit,
  flagManipulateList,
} from "@/types/GameStoryEditor.ts";
import { computed } from "vue";
import { useGameStoryEditorStore } from "@/store/store.ts";

const useStore = useGameStoryEditorStore();

const props = defineProps<{
  uuid: string;
  storyUnit: StoryEditorTextUnit;
}>();

const currentStoryUnit = computed({
  get: () => {
    const storyUnit = props.storyUnit;
    if (["setFlag", "manipulateFlag"].includes(storyUnit.command || "")) {
      if (
        !Array.isArray(storyUnit.commandArgs) ||
        0 === storyUnit.commandArgs.length
      ) {
        storyUnit.commandArgs = ["", "", ""];
      }
    }
    return storyUnit;
  },
  set: newValue => {
    useStore.updateStoryUnit(props.uuid, newValue.id, newValue);
  },
});

const flagName = computed({
  get: () => ((currentStoryUnit.value.commandArgs || [])[0] || "") as string,
  set: newValue => {
    if (
      !Array.isArray(currentStoryUnit.value.commandArgs) ||
      0 === currentStoryUnit.value.commandArgs.length
    ) {
      currentStoryUnit.value.commandArgs = ["", "", ""];
    }
    currentStoryUnit.value.commandArgs[0] = newValue;
  },
});

const flagManipulation = computed({
  get: () => ((currentStoryUnit.value.commandArgs || [])[1] || "") as string,
  set: newValue => {
    if (
      !Array.isArray(currentStoryUnit.value.commandArgs) ||
      0 === currentStoryUnit.value.commandArgs.length
    ) {
      currentStoryUnit.value.commandArgs = ["", "", ""];
    }
    currentStoryUnit.value.commandArgs[1] = newValue;
  },
});

const flagManipulateParam = computed({
  get: () => ((currentStoryUnit.value.commandArgs || [])[2] || "") + "",
  set: newValue => {
    if (
      !Array.isArray(currentStoryUnit.value.commandArgs) ||
      0 === currentStoryUnit.value.commandArgs.length
    ) {
      currentStoryUnit.value.commandArgs = ["", "", ""];
    }
    currentStoryUnit.value.commandArgs[2] = newValue;
  },
});

const waitTime = computed({
  // @ts-ignore
  get: () => ((currentStoryUnit.value.commandArgs || [])[0] || 0) * 1,
  set: newValue => {
    currentStoryUnit.value.commandArgs = [newValue];
  },
});
</script>

<template>
  <a-space size="medium" fill>
    <a-space direction="vertical" size="small">
      <h1>场景特效或指令</h1>
      <a-select
        allow-clear
        v-model="currentStoryUnit.command"
        :options="commandList"
        :virtual-list-props="{ fixedSize: true }"
        style="min-width: 134px"
      />
    </a-space>
    <a-space
      direction="vertical"
      size="small"
      v-if="
        ['setFlag', 'manipulateFlag'].includes(currentStoryUnit.command || '')
      "
    >
      <h1>Flag 名</h1>
      <a-input allow-clear placeholder="Flag 名" v-model="flagName" />
    </a-space>
    <a-space
      direction="vertical"
      size="small"
      v-if="
        ['setFlag', 'manipulateFlag'].includes(currentStoryUnit.command || '')
      "
    >
      <h1>Flag 操作</h1>
      <a-select
        allow-clear
        v-model="flagManipulation"
        :options="flagManipulateList"
        style="min-width: 134px"
      />
    </a-space>
    <a-space
      direction="vertical"
      size="small"
      v-if="
        ['setFlag', 'manipulateFlag'].includes(
          currentStoryUnit.command || ''
        ) && 'setOpposite' !== flagManipulation
      "
    >
      <h1>参数</h1>
      <a-input allow-clear v-model="flagManipulateParam" style="width: 80px" />
    </a-space>
    <a-space
      direction="vertical"
      v-if="'wait' === currentStoryUnit.command"
      size="small"
    >
      <h1>等待时间</h1>
      <a-input-number :step="50" allow-clear v-model="waitTime">
        <template #suffix>毫秒</template>
      </a-input-number>
    </a-space>
  </a-space>
</template>

<style scoped lang="scss"></style>
