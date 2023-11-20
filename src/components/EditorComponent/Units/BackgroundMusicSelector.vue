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
  currentPlayingBgm.value = "";
}

getBgmList();

function handleBgmSelect(newValue: string) {
  selectedBgm.value = newValue;
  modalVisible.value = false;
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

const audioMap = new Map<string, Howl>();
const audioVolume = ref(10);

function getAudio(url: string): Howl {
  const audio = audioMap.get(url);
  if (audio) {
    return audio;
  } else {
    const newAudio = new Howl({
      src: url,
      html5: true,
      autoplay: false,
      preload: true,
      volume: audioVolume.value / 100,
    });
    audioMap.set(url, newAudio);
    return newAudio;
  }
}

watch(
  () => currentPlayingBgm.value,
  newValue => {
    if (newValue === "") {
      for (const audio of audioMap.values()) {
        audio.stop();
      }
      Howler.unload();
    } else {
      const audio = getAudio(`https://bgm.blue-archive.io/${newValue}.mp3`);
      audio.play();
    }
  }
);

watch(
  () => audioVolume.value,
  newValue => {
    for (const audio of audioMap.values()) {
      audio.volume(newValue / 100);
    }
  }
);

function requestPlayAudio(filename: string) {
  currentPlayingBgm.value = filename;
}
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
        <a-input-group>
          <a-input
            allow-clear
            placeholder="搜索音乐"
            v-model="searchValue"
            style="flex: 1"
          />
          <a-button
            @click="getBgmList"
            :loading="loadingState"
            :disabled="loadingState"
          >
            <template #icon>
              <icon-refresh />
            </template>
          </a-button>
        </a-input-group>

        <a-space>
          <a-button type="text">
            <template #icon>
              <icon-sound-fill />
            </template>
          </a-button>
          <a-slider
            v-model="audioVolume"
            :default-value="50"
            :style="{ width: '200px' }"
          />
        </a-space>
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
              @request-play="requestPlayAudio"
              :selected="selectedBgm === item.filename"
            />
          </a-list-item>
        </template>
      </a-list>
    </div>
  </a-modal>
</template>

<style scoped lang="scss"></style>
