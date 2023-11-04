<script setup lang="ts">
import {
  SidebarStoryListUnit,
  SidebarStoryUnitListUnit,
} from "@/types/GameStoryEditor.ts";
import { computed } from "vue";
import { useGameStoryEditorStore } from "@/store/store.ts";
import { unitType } from "@/types/GameStoryEditor.ts";

const useStore = useGameStoryEditorStore();

const props = defineProps<{
  mode: "storyList" | "storyEditor";
  uuid?: string;
}>();

const isStoryListMode = computed(() => props.mode === "storyList");

const list = computed(() => {
  if (isStoryListMode.value) {
    return useStore.getStoryList;
  } else {
    return useStore.getStoryByUuid(props.uuid as string)?.content ?? [];
  }
});

function scrollToPosition(uuid: string) {
  const element = document.getElementById(uuid);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
}

function getDisplayText(item: SidebarStoryUnitListUnit) {
  switch (item.type) {
    case "text" || "place" || "title" || "st":

    default:
      return unitType.find((unit) => unit.value === item.type)?.label ?? item.type;
  }
}
</script>

<template>
  <div class="sidebar-container bg-white">
    <div>
      <h2 class="pl-4 pt-8 sticky top-0 bg-white">
        导航
        <a-divider />
      </h2>
      <a-space direction="vertical" size="mini" fill v-if="isStoryListMode">
        <a-tooltip
          v-for="item in list as SidebarStoryListUnit[]"
          position="right"
          :content="item.description ? item.description : '此段剧情暂无描述'"
        >
          <a-button
            type="text"
            class="!justify-start"
            long
            @click="scrollToPosition(item.uuid)"
          >
            {{ item.serial }}
          </a-button>
        </a-tooltip>
      </a-space>

      <a-space direction="vertical" size="mini" fill v-else>
        <a-tooltip
          v-for="item in list as SidebarStoryUnitListUnit[]"
          position="right"
          :content="item.text ? item.text : '此段剧情暂无描述'"
        >
          <a-button
            type="text"
            class="!justify-start"
            long
            @click="scrollToPosition(item.id.toString())"
          >
            {{ getDisplayText(item) }}
          </a-button>
        </a-tooltip>
      </a-space>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar-container {
  height: calc(100vh - var(--header-height, 32px));
  height: calc(100dvh - var(--header-height, 32px));
  overflow: scroll;
  padding: 0 24px;

  h2 {
    z-index: 999;
  }
}
</style>
