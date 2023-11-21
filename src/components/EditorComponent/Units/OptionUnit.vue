<script setup lang="ts">
import { flagConditionList, SelectionGroup } from "@/types/GameStoryEditor.ts";
import EffectOnlyUnit from "@components/EditorComponent/Units/EffectOnlyUnit.vue";
import PlaceUnit from "@components/EditorComponent/Units/PlaceUnit.vue";
import StUnit from "@components/EditorComponent/Units/StUnit.vue";
import TextUnit from "@components/EditorComponent/Units/TextUnit.vue";
import { computed } from "vue";

const unitTypeComponentMap = [
  {
    type: "effectOnly",
    component: EffectOnlyUnit,
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
];

const props = defineProps<{
  uuid: string;
  selectionGroup: SelectionGroup;
}>();

const emit = defineEmits<{
  (event: "update-value", value: SelectionGroup): void;
}>();

const currentSelectionGroup = computed({
  get: () => props.selectionGroup,
  set: (newValue: SelectionGroup) => {
    emit("update-value", newValue);
  },
});

const flagName = computed({
  get: () =>
    (currentSelectionGroup.value.condition || ["", "Less", ""])[0] as string,
  set: newValue => {
    currentSelectionGroup.value.condition[0] = newValue;
  },
});

const flagCondition = computed({
  get: () =>
    (currentSelectionGroup.value.condition || ["", "Less", ""])[1] as string,
  set: newValue => {
    currentSelectionGroup.value.condition[1] = newValue;
  },
});

const flagConditionParam = computed({
  get: () => (currentSelectionGroup.value.condition || ["", "Less", ""])[2],
  set: (newValue: string) => {
    currentSelectionGroup.value.condition[2] = newValue;
  },
});

function handleAddNewUnit() {
  currentSelectionGroup.value.content.push({
    id: Date.now().valueOf(),
    type: "title",
    backgroundImage: "",
    bgm: "",
    speaker: "",
    affiliation: "",
    text: "",
    characters: [],
  });
}
</script>

<template>
  <div class="option-container rounded-md flex flex-col gap-4 w-full p-4">
    <a-card :bordered="false">
      <a-space direction="vertical" size="medium" fill>
        <a-space size="small" direction="vertical" fill>
          <h1>选项内容</h1>
          <a-input
            allow-clear
            placeholder="选项内容"
            v-model="currentSelectionGroup.text"
          />
        </a-space>
        <a-checkbox> 需要条件 </a-checkbox>
        <a-space size="small" direction="vertical" fill>
          <h1>选项条件</h1>
          <a-input-group>
            <a-input allow-clear placeholder="Flag" v-model="flagName">
              <template #prefix>Flag 名称</template>
            </a-input>
            <a-select
              v-model="flagCondition"
              :options="flagConditionList"
              :virtual-list-props="{ fixedSize: true }"
              placeholder="条件"
            >
              <template #prefix>条件</template>
            </a-select>
            <a-input
              allow-clear
              placeholder="参数"
              v-model="flagConditionParam"
            >
              <template #prefix>参数</template>
            </a-input>
          </a-input-group>
        </a-space>
      </a-space>
    </a-card>
    <a-card
      v-for="content in selectionGroup.content"
      :bordered="false"
      :id="props.selectionGroup.id"
      :class="{}"
    >
      <component
        :is="
          unitTypeComponentMap.find(item => item.type === content.type)
            ?.component || null
        "
        :uuid="props.uuid"
        :storyUnit="content"
      />
    </a-card>
    <a-button long type="primary" @click="handleAddNewUnit">
      添加选项内容
    </a-button>
  </div>
</template>

<style scoped lang="scss">
.option-container {
  border: 2px dashed rgb(var(--arcoblue-6));
}
</style>
