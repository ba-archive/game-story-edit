<template>
  <div class="main-editor__container">
    <editor-sidebar class="sidebar shadow-sm" mode="storyEditor" :uuid="uuid" />

    <div
      class="main-editor__container__main flex flex-col gap-4"
      v-draggable="[
        story?.content,
        {
          animation: 175,
        },
      ]"
    >
      <card-component-container
        v-for="storyUnit in story?.content"
        :uuid="uuid"
        :story-unit="storyUnit"
        :key="storyUnit.id"
      />
      <a-divider />
      <a-button-group>
        <a-button type="primary" long @click="addNewStoryUnit"
          >添加新卡片</a-button
        >
        <a-dropdown
          trigger="hover"
          position="br"
          @select="handleChangeUnitType"
        >
          <a-button type="primary">
            <template #icon>
              <icon-down />
            </template>
          </a-button>
          <template #content>
            <a-doption
              v-for="item in unitTypeWithoutOption"
              :value="item.value"
              >{{ item.label }}</a-doption
            >
          </template>
        </a-dropdown>
      </a-button-group>
    </div>

    <editor-footer class="footer" :uuid="uuid" />
  </div>
</template>

<script setup lang="ts">
import EditorFooter from "./EditorFooter.vue";
import EditorSidebar from "./EditorSidebar.vue";
import CardComponentContainer from "@components/EditorComponent/CardComponentContainer.vue";
import { useGameStoryEditorStore } from "@/store/store";
import { useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import {
  SelectionGroup,
  StoryEditorTextUnit,
  unitTypeWithoutOption,
} from "@/types/GameStoryEditor";
import { getShanghaiDate } from "@/helper/date.ts";
import { eventSystem } from "@/eventSystem/eventSystem.ts";
import { vDraggable } from "vue-draggable-plus";
import { Story } from "@/types/GameStoryEditor";

const router = useRouter();
const useStore = useGameStoryEditorStore();

const uuid = computed(() => router.currentRoute.value.params.uuid as string);

const story = computed({
  get: () => useStore.getStoryByUuid(uuid.value),
  set: newValue => {
    useStore.overwriteStory(newValue as Story);
  },
});

watch(
  () => story.value,
  () => {
    eventSystem.emit("story-changed", uuid.value);
  },
  {
    deep: true,
  }
);

const selectedUnitType = ref(
  unitTypeWithoutOption[0].value as StoryEditorTextUnit["type"]
);

function addNewStoryUnit() {
  useStore.addNewStoryUnit(uuid.value, {
    id: getShanghaiDate().valueOf(),
    type: selectedUnitType.value,
    backgroundImage: "",
    selectionGroups: [
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
    bgm: "",
    speaker: "",
    affiliation: "",
    text: "",
    characters: [],
    script: "",
  });
}

function handleChangeUnitType(unitType: StoryEditorTextUnit["type"]) {
  selectedUnitType.value = unitType;
  addNewStoryUnit();
}
</script>

<style scoped lang="scss">
.main-editor {
  &__container {
    flex: 1;

    display: grid;
    grid-template-areas:
      "sidebar main"
      "sidebar footer";
    grid-template-rows: 1fr min-content;
    grid-template-columns: 240px 1fr;
    gap: 0;
  }
}

.footer {
  grid-area: footer;
  z-index: 997;
}

.sidebar {
  grid-area: sidebar;
  z-index: 998;
}

.main-editor__container__main {
  grid-area: main;
  overflow: scroll;
  $inner-width: 684px;
  padding: 24px calc((100% - #{$inner-width}) / 2);
  height: calc(100vh - var(--header-height, 32px) - var(--footer-height, 64px));
}
</style>
