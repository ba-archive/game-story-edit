<script setup lang="ts">
import {
  SelectionGroup,
  StoryEditorTextUnit,
  unitTypeWithoutOption,
} from "@/types/GameStoryEditor.ts";
import { ref, computed, watch } from "vue";
import { useGameStoryEditorStore } from "@/store/store.ts";
import TitleUnit from "@components/EditorComponent/Units/TitleUnit.vue";
import EffectOnlyUnit from "@components/EditorComponent/Units/EffectOnlyUnit.vue";
import SelectionUnit from "@components/EditorComponent/Units/SelectionUnit.vue";
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
    type: "select",
    component: SelectionUnit,
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
    type: "continue",
    component: ToBeContinueUnit,
  },
];

const props = defineProps<{
  uuid: string;
  storyUnit: StoryEditorTextUnit;
}>();

const currentStoryUnit = ref(props.storyUnit);

const currentUnitType = computed({
  get: () => props.storyUnit.type,
  set: newValue => {
    currentStoryUnit.value.type = newValue;
  },
});

function deleteCurrentStoryUnit() {
  useStore.deleteStoryUnit(props.uuid, props.storyUnit.id);
}

function handleAddNewUnitBelow() {
  useStore.addNewStoryUnit(
    props.uuid,
    {
      id: Date.now().valueOf(),
      type: "title",
      backgroundImage: "",
      bgm: "",
      speaker: "",
      affiliation: "",
      text: "",
      characters: [],
    },
    props.storyUnit.id
  );
}

function handleValueChange(newValue: StoryEditorTextUnit) {
  useStore.updateStoryUnit(props.uuid, newValue.id, newValue);
}

function getUnitTypeDescription(type: string) {
  return (
    unitTypeWithoutOption.find(item => item.value === type)?.description || ""
  );
}
watch(
  () => currentUnitType.value,
  newValue => {
    if ("select" === newValue) {
      if (!currentStoryUnit.value.selectionGroups) {
        currentStoryUnit.value.selectionGroups = [
          {
            id: Date.now().valueOf(),
            type: "option",
            text: "",
            isConditional: false,
            condition: [
              "",
              "Less",
              "",
            ] as unknown as SelectionGroup["condition"],
            content: [] as StoryEditorTextUnit[],
          },
        ];
      }
    }
  }
);
</script>

<template>
  <a-card
    :bordered="false"
    :id="props.storyUnit.id"
    :class="{
      'is-selection': 'select' === props.storyUnit.type,
    }"
  >
    <component
      :is="
        unitTypeComponentMap.find(item => item.type === currentUnitType)
          ?.component || null
      "
      :uuid="props.uuid"
      :storyUnit="currentStoryUnit"
      @value-change="handleValueChange"
    />

    <template #title>
      <a-space>
        <a-select
          v-model="currentUnitType"
          style="width: 10rem"
          :options="unitTypeWithoutOption"
        />
        <a-tooltip :content="getUnitTypeDescription(currentUnitType)">
          <icon-question-circle class="cursor-pointer" />
        </a-tooltip>
      </a-space>
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
        <a-button type="outline" size="mini" @click="handleAddNewUnitBelow"
          >在下方插入</a-button
        >
      </a-space>
    </template>
  </a-card>
</template>

<style lang="scss">
.is-selection {
  background-color: transparent;

  & > .arco-card-body {
    margin-top: 1rem;
    padding: 0;
  }

  & > .arco-card-header {
    border: none;
    background: var(--color-bg-2);
  }
}
</style>
