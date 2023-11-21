<script setup lang="ts">
import { SelectionGroup } from "@/types/GameStoryEditor.ts";
import EffectOnlyUnit from "@components/EditorComponent/Units/EffectOnlyUnit.vue";
import PlaceUnit from "@components/EditorComponent/Units/PlaceUnit.vue";
import StUnit from "@components/EditorComponent/Units/StUnit.vue";
import TextUnit from "@components/EditorComponent/Units/TextUnit.vue";

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
</script>

<template>
  <div class="option-container flex flex-col gap-4">
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
  </div>
</template>

<style scoped lang="scss">
.option-container {
  border-radius: 4;
}
</style>
