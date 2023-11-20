<script setup lang="ts">
import axios from "axios";
import { computed, ref, watch } from "vue";
import { Message } from "@arco-design/web-vue";
import MusicPlayer from "@components/EditorComponent/Widgets/MusicPlayer.vue";
import { BgmInfo } from "@/types/GameStoryEditor.ts";
import { Howler, Howl } from "howler";

const props = defineProps<{
  currentBgm: string;
}>();

const emit = defineEmits<{
  (event: "value-change", value: string): void;
}>();

const staticBgmList = ref<BgmInfo[]>();
const bgmList = ref<BgmInfo[]>();
const loadingState = ref(true);
const modalVisible = ref(false);
const searchValue = ref("");
const currentPlayingBgm = ref("");

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

function handleReset() {
  selectedBgm.value = "";
}

getBgmList();

function handleBgmSelect(newValue: string) {
  selectedBgm.value = newValue;
}

watch(
  () => searchValue.value,
  newValue => {
    if (newValue === "") {
      bgmList.value = staticBgmList.value;
    }
    bgmList.value = staticBgmList.value?.filter(bgm =>
      bgm.filename.toLowerCase().includes(newValue.toLowerCase())
    );
  }
);

const virtualListHeight = computed(() => window.innerHeight * 0.5);
</script>

<template>
  <a-button-group>
    <a-button @click="modalVisible = true" long> 选择音乐… </a-button>
    <a-button status="danger" @click="handleReset">
      <template #icon>
        <icon-delete />
      </template>
    </a-button>
  </a-button-group>
  <a-modal
    v-model:visible="modalVisible"
    title="选择音乐"
    unmount-on-close
    @close="modalVisible = false"
    @cancel="modalVisible = false"
    @ok="emit('value-change', selectedBgm)"
  >
    <div class="flex flex-col gap-4">
      <div class="w-full flex gap-4">
        <a-input
          allow-clear
          placeholder="搜索音乐"
          v-model="searchValue"
          style="flex: 1"
        />
        <a-button
          type="text"
          @click="getBgmList"
          :loading="loadingState"
          :disabled="loadingState"
        >
          <template #icon>
            <icon-refresh />
          </template>
        </a-button>
      </div>
      <a-list
        fill
        :virtualListProps="{
          fixedSize: true,
          height: virtualListHeight,
        }"
        :data="bgmList"
        size="large"
        :bordered="false"
        :style="{ height: '50vh' }"
      >
        <template #item="{ item, index }">
          <a-list-item :key="index">
            <music-player
              :bgm="item"
              @value-change="handleBgmSelect"
              :selected="selectedBgm === item.filename"
            />
          </a-list-item>
        </template>
      </a-list>
    </div>
  </a-modal>
</template>

<style scoped lang="scss"></style>
