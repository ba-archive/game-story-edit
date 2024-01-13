<script setup lang="ts">
import {
  flagConditionList,
  SelectionGroup,
  unitTypeInSelectionGroup,
} from "@/types/GameStoryEditor.ts";
import EffectOnlyUnit from "@components/EditorComponent/Units/EffectOnlyUnit.vue";
import PlaceUnit from "@components/EditorComponent/Units/PlaceUnit.vue";
import StUnit from "@components/EditorComponent/Units/StUnit.vue";
import TextUnit from "@components/EditorComponent/Units/TextUnit.vue";
import { computed } from "vue";
import { unitType } from "@/types/GameStoryEditor.ts";
import { getShanghaiDate } from "@/helper/date.ts";

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
  (event: "request-delete", id: number): void;
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
    id: getShanghaiDate().valueOf(),
    type: "text",
    backgroundImage: "",
    bgm: "",
    speaker: "",
    affiliation: "",
    text: "",
    characters: [],
    script: "",
  });
}

function handleAddNewUnitBelow() {
  const index = currentSelectionGroup.value.content.findIndex(
    item => item.id === props.selectionGroup.id
  );
  currentSelectionGroup.value.content.splice(index, 0, {
    id: getShanghaiDate().valueOf(),
    type: "text",
    backgroundImage: "",
    bgm: "",
    speaker: "",
    affiliation: "",
    text: "",
    characters: [],
    script: "",
  });
}

function handleDeleteStoryUnit(id: number) {
  currentSelectionGroup.value.content =
    currentSelectionGroup.value.content.filter(item => item.id !== id);
}

function getUnitTypeDescription(type: string) {
  return unitType.find(item => item.value === type)?.description || "未知类型";
}

function handleRequestDeleteSelectionGroup() {
  emit("request-delete", props.selectionGroup.id);
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
        <a-checkbox v-model="currentSelectionGroup.isConditional">
          需要条件才能继续
        </a-checkbox>
        <a-space
          v-if="currentSelectionGroup.isConditional"
          size="small"
          direction="vertical"
          fill
        >
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
        <div class="w-full flex justify-end">
          <a-popconfirm
            type="warning"
            ok-text="删除"
            @ok="handleRequestDeleteSelectionGroup"
          >
            <template #content>
              <div>你确定要删除吗？</div>
              <div>删除的内容无法恢复。</div>
            </template>
            <a-button type="outline" status="danger"> 删除选项组 </a-button>
          </a-popconfirm>
        </div>
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

      <details class="mt-4" close>
        <summary>高级选项</summary>

        <a-space class="mt-0" size="mini" direction="vertical" fill>
          <h1>script</h1>
          <a-input
            v-model="currentSelectionGroup.script"
            allow-clear
            placeholder="脚本命令"
          />
        </a-space>
      </details>
      <template #title>
        <a-space>
          <a-select
            v-model="content.type"
            style="width: 10rem"
            :options="unitTypeInSelectionGroup"
          />
          <a-tooltip :content="getUnitTypeDescription(content.type)">
            <icon-question-circle class="cursor-pointer" />
          </a-tooltip>
        </a-space>
      </template>
      <template #extra>
        <a-space>
          <a-popconfirm
            type="warning"
            ok-text="删除"
            @ok="handleDeleteStoryUnit(content.id)"
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
    <a-button long type="outline" @click="handleAddNewUnit">
      添加新内容
    </a-button>
  </div>
</template>

<style scoped lang="scss">
.option-container {
  border: 2px dashed rgb(var(--arcoblue-6));
}
</style>
