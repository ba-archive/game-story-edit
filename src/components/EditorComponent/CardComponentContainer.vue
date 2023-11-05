<script setup lang="ts">
import { StoryEditorTextUnit, unitType } from "@/types/GameStoryEditor.ts";
import { ref } from "vue";
import { useGameStoryEditorStore } from "@/store/store.ts";

const useStore = useGameStoryEditorStore();

const props = defineProps<{
  uuid: string;
  storyUnit: StoryEditorTextUnit;
}>();

const currentUnitType = ref(props.storyUnit.type);

const currentStoryUnit = ref(props.storyUnit);

function handleStoryUnitTypeChange(unitType: StoryEditorTextUnit["type"]) {
  currentStoryUnit.value.type = unitType;
}

function deleteCurrentStoryUnit() {
  useStore.deleteStoryUnit(props.uuid, props.storyUnit.id);
}
</script>

<template>
  <a-card :bordered="false" hoverable :id="props.storyUnit.id">
    <template #title>
      <a-select
        v-model="currentUnitType"
        style="width: 8rem"
        @change="handleStoryUnitTypeChange"
      >
        <a-option
          v-for="item in unitType"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </a-select>
    </template>
    <template #extra>
      <a-space>
        <a-popconfirm
          type="warning"
          ok-text="删除"
          @ok="deleteCurrentStoryUnit"
        >
          <a-button type="text" size="mini" status="danger">删除</a-button>
          <template #content>
            <div>你确定要删除吗？</div>
            <div>删除的内容无法恢复。</div>
          </template>
        </a-popconfirm>
        <a-button type="outline" size="mini">在下方插入</a-button>
      </a-space>
    </template>
  </a-card>
</template>

<style scoped lang="scss"></style>
