<script setup lang="ts">
import { ref, watch } from "vue";
import { StoryEditorTextUnit } from "@/types/GameStoryEditor";
import { useGameStoryEditorStore } from "@/store/store";

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
  <a-space direction="vertical" size="medium" fill>
    <a-space direction="vertical" size="small">
      <h1>标题内容</h1>
      <a-input-group>
        <a-input allow-clear placeholder="小标题内容">
          <template #prefix>小标题</template>
        </a-input>
        <a-input allow-clear placeholder="大标题内容">
          <template #prefix>大标题</template>
        </a-input>
      </a-input-group>
    </a-space>
    <a-space direction="horizontal" size="medium">
      <a-space direction="vertical" size="small">
        <h1>背景</h1>
      </a-space>
      <a-image> </a-image>
    </a-space>
  </a-space>
</template>

<style scoped lang="scss"></style>
