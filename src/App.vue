<script setup lang="ts">
import PageHeader from "./components/PageHeader.vue";

import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import StoryListContainer from "@components/StoryListContainer.vue";
import { useElementSize } from "@vueuse/core";
import { eventSystem } from "@/eventSystem/eventSystem.ts";
import { useGameStoryEditorStore } from "@/store/store.ts";
import { updateStoryContent } from "@/helper/comm.ts";
import { Message } from "@arco-design/web-vue";

const router = useRouter();
const useStore = useGameStoryEditorStore();

const isHomeRoute = computed(() => router.currentRoute.value.name === "Home");

const headerElement = ref<HTMLElement | null>(null);

const { height } = useElementSize(headerElement);

watch(height, newHeight => {
  document.body.style.setProperty("--header-height", `${newHeight}px`);
});

onMounted(() => {
  document.body.style.setProperty("--header-height", `${height.value}px`);
  import("@components/EditorComponent/CardComponentContainer.vue");
});

let lastUpdatedTimestamp = 0;

async function handleStoryChange(uuid: string) {
  const storyContent = useStore.getStoryByUuid(uuid);
  if (!storyContent) return;

  const currentTimeStamp = Date.now();
  if (currentTimeStamp - lastUpdatedTimestamp < 5000) return;
  const response = await updateStoryContent(uuid, storyContent);

  if (response.status === 200) {
    Message.success("自动同步到云端成功：" + uuid);
    lastUpdatedTimestamp = currentTimeStamp;
  } else {
    Message.error(`云端同步失败：${uuid}，将会在下一次修改时重试`);
  }
}

eventSystem.on("story-changed", async uuid => handleStoryChange(uuid));
</script>

<template>
  <div class="header bg-white shadow-sm" ref="headerElement">
    <page-header />
  </div>
  <div class="main-view">
    <story-list-container v-if="isHomeRoute" />
    <router-view></router-view>
  </div>
</template>

<style scoped lang="scss">
.header {
  grid-area: header;
  z-index: 999;
}

.main-view {
  grid-area: main;

  display: flex;
  flex-direction: column;
  overflow: scroll;
}
</style>
