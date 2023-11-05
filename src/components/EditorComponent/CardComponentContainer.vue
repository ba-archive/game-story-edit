<script setup lang="ts">
import {
  StoryEditorTextUnit,
  unitTypeWithoutOption,
} from "@/types/GameStoryEditor.ts";
import { ref } from "vue";
import { useGameStoryEditorStore } from "@/store/store.ts";
import TitleUnit from "@components/EditorComponent/Units/TitleUnit.vue";
import EffectOnlyUnit from "@components/EditorComponent/Units/EffectOnlyUnit.vue";
import OptionUnit from "@components/EditorComponent/Units/OptionUnit.vue";
import PlaceUnit from "./Units/PlaceUnit.vue";
import StUnit from "./Units/StUnit.vue";
import TextUnit from "./Units/TextUnit.vue";
import ToBeContinueUnit from "./Units/ToBeContinueUnit.vue";

const useStore = useGameStoryEditorStore();

const unitTypeComponentMap = [
  {
    type: "title",
    component: TitleUnit,
  },
  {
    type: "effectOnly",
    component: EffectOnlyUnit,
  },
  {
    type: "option",
    component: OptionUnit,
  },
  {
    type: "place",
    component: PlaceUnit,
  },
  {
    type: "st",
    component: StUnit,
  },
  {
    type: "text",
    component: TextUnit,
  },
  {
    type: "toBeContinue",
    component: ToBeContinueUnit,
  },
];

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
    <component
      :is="
        unitTypeComponentMap.find(item => item.type === currentUnitType)
          ?.component || null
      "
      :uuid="props.uuid"
      :storyUnit="currentStoryUnit"
    />

    <template #title>
      <a-select
        v-model="currentUnitType"
        style="width: 8rem"
        @change="handleStoryUnitTypeChange"
      >
        <a-option
          v-for="item in unitTypeWithoutOption"
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
