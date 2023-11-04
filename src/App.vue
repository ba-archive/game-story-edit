<script setup lang="ts">
import PageHeader from "./components/PageHeader.vue";

import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import StoryListContainer from "@components/StoryListContainer.vue";
import { useElementSize } from "@vueuse/core";

const router = useRouter();

const isHomeRoute = computed(() => router.currentRoute.value.name === "Home");

const headerElement = ref<HTMLElement | null>(null);

const { height } = useElementSize(headerElement);

watch(height, newHeight => {
  document.body.style.setProperty("--header-height", `${newHeight}px`);
});

onMounted(() => {
  document.body.style.setProperty("--header-height", `${height.value}px`);
});
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
