<script setup lang="ts">
import {
  SidebarStoryListUnit,
  SidebarStoryUnitListUnit,
  StoryEditorTextUnit,
} from "@/types/GameStoryEditor.ts";
import { computed, ref } from "vue";
import { useGameStoryEditorStore } from "@/store/store.ts";
import { unitType } from "@/types/GameStoryEditor.ts";
import { eventSystem } from "@/eventSystem/eventSystem";

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

const displayList = ref(list.value);

eventSystem.on("list-sorted", sortedList => {
  if (isStoryListMode.value) {
    displayList.value = sortedList;
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
    case "title":
      return item.text?.replace(";", " ") || "标题";
    case "select":
      return "选项";
    case "text":
      return item.speaker
        ? `对话（${item.speaker}）：${item.text}`.slice(0, 10) + "…"
        : "旁白";
    default:
      return (
        unitType.find(unit => unit.value === item.type)?.label ?? item.type
      );
  }
}

function getTooltipText(storyUnit: StoryEditorTextUnit) {
  switch (storyUnit.type) {
    case "title":
      return storyUnit.text?.replace(";", " ") || "标题";
    case "text":
      return `${storyUnit.speaker ?? ""}：${storyUnit.text?.replaceAll(
        "\n",
        "<br>"
      )}`;
    case "effectOnly":
      // FIXME 改成显示效果
      return storyUnit.text?.replaceAll("\n", "<br>") || "此段剧情暂无描述";

    case "continue":
      return 0 === (storyUnit.text?.length ?? 0)
        ? "To Be Continued"
        : storyUnit.text;
    default:
      return storyUnit.text?.replaceAll("\n", "<br>") || "此段剧情暂无描述";
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
          v-for="item in displayList as SidebarStoryListUnit[]"
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
        >
          <template #content>
            <span v-html="getTooltipText(item)" />
          </template>
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
