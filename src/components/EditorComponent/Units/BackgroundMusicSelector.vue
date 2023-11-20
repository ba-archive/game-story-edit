<script setup lang="ts">
import axios from "axios";
import { computed, ref } from "vue";
import { Message } from "@arco-design/web-vue";

export interface BgmInfo {
  filename: string;
  format: "mp3";
  md5_hash: string;
}

const props = defineProps<{
  currentBgm: string;
}>();

const staticBgmList = ref<BgmInfo[]>();
const bgmList = ref<BgmInfo[]>();
const loadingState = ref(true);
const modalVisible = ref(false);
const searchValue = ref("");

function getBgmList() {
  loadingState.value = true;
  axios
    .get("/bgm_list.json")
    .then(res => {
      if (200 !== res.status) {
        Message.error("背景音乐列表获取失败");
      }
      staticBgmList.value = res.data as BgmInfo[];
      bgmList.value = res.data as BgmInfo[];
      loadingState.value = false;
    })
    .catch(() => {
      Message.error("背景音乐列表获取失败");
      loadingState.value = false;
    });
}

const selectedBgm = computed({
  get: () => props.currentBgm,
  set: (value: string) => {
    emit("value-change", value);
  },
});

const emit = defineEmits<{
  (event: "value-change", value: string): void;
}>();

getBgmList();

function handleReset() {}
</script>

<template>
  <a-button-group>
    <a-button @click="modalVisible = true" long> 选择图片… </a-button>
    <a-button status="danger" @click="handleReset">
      <template #icon>
        <icon-delete />
      </template>
    </a-button>
  </a-button-group>
</template>

<style scoped lang="scss"></style>
