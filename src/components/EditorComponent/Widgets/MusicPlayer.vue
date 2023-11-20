<script setup lang="ts">
import { computed } from "vue";
import { BgmInfo } from "@/types/GameStoryEditor.ts";

const props = defineProps<{
  bgm: BgmInfo;
}>();

const emit = defineEmits<{
  (event: "value-change", value: string): void;
  (event: "request-play", value: string): void;
}>();

const selectedBgm = computed({
  get: () => props.bgm,
  set: newValue => {
    emit("value-change", newValue.filename);
  },
});

function handlePlay(bgmName: string) {
  emit("request-play", bgmName);
}

function handleSelect() {
  emit("request-play", "");
  emit("value-change", selectedBgm.value.filename);
}
</script>

<template>
  <div class="flex w-full justify-between pt-2 pb-2">
    <h1>{{ bgm.filename }}</h1>
    <a-space size="small">
      <a-button type="text" size="mini" @click="handlePlay(bgm.filename)"
        >播放</a-button
      >
      <a-button type="outline" size="mini" @click="handleSelect">
        选择
      </a-button>
    </a-space>
  </div>
</template>

<style scoped lang="scss"></style>
