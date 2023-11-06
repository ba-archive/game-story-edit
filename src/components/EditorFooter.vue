<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useElementSize } from "@vueuse/core";
import { useGameStoryEditorStore } from "@/store/store.ts";
import { Message } from "@arco-design/web-vue";
import { saveFile } from "@/helper/fileSaver.ts";

const useStore = useGameStoryEditorStore();

const props = withDefaults(
  defineProps<{
    uuid?: string;
  }>(),
  {
    uuid: "",
  }
);

const outputRawFile = ref(false);
const footerElement = ref<HTMLElement | null>(null);

const { height } = useElementSize(footerElement);

onMounted(() => {
  document.body.style.setProperty("--footer-height", `${height.value}px`);
});

watch(height, newHeight => {
  document.body.style.setProperty("--footer-height", `${newHeight + 32}px`);
});

function handleSaveFileRequest() {
  const story = useStore.getStoryByUuid(props.uuid);
  if (!story) {
    Message.error("未找到该剧情");
    return;
  }
  const storyData = JSON.stringify(story, null, 2);
  saveFile(`${story.serial}.json`, storyData);
}
</script>

<template>
  <a-space
    class="p-4 bg-white shadow-y-upper footer__container justify-center"
    size="large"
    fill
    align="center"
    ref="footerElement"
  >
    <!--    <a-checkbox v-model="outputRawFile">输出 RAW 文件</a-checkbox>-->
    <a-button type="primary" @click="handleSaveFileRequest"
      >保存到本地</a-button
    >
  </a-space>
</template>

<style scoped lang="scss"></style>
