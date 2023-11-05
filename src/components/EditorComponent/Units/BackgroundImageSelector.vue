<script setup lang="ts">
import axios from "axios";
import { ref, watch } from "vue";
import { Message } from "@arco-design/web-vue";
import { getImageUrl } from "@/helper/image.ts";

export interface ImageInfo {
  filename: string;
  format: "jpg";
  md5_hash: string;
}

const staticImageList = ref<ImageInfo[]>();
const imageList = ref<ImageInfo[]>();
const loadingState = ref(true);
const modalVisible = ref(false);
const searchValue = ref("");

function getImageList() {
  loadingState.value = true;
  axios
    .get("/image_list.json")
    .then(res => {
      if (200 !== res.status) {
        Message.error("图片列表获取失败");
      }
      staticImageList.value = res.data as ImageInfo[];
      imageList.value = res.data as ImageInfo[];
      loadingState.value = false;
    })
    .catch(() => {
      Message.error("图片列表获取失败");
      loadingState.value = false;
    });
}

const emit = defineEmits<{
  (event: "value-change", value: string): void;
}>();

watch(
  () => searchValue.value,
  newValue => {
    if (newValue === "") {
      imageList.value = staticImageList.value;
    }
    imageList.value = staticImageList.value?.filter(image =>
      image.filename.toLowerCase().includes(newValue.toLowerCase())
    );
  }
);

const selectedImage = ref("");

const imageContainerElement = ref<HTMLElement>();

function handleReset() {
  selectedImage.value = "";
  emit("value-change", "");
}

function handleOpenWindow(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

getImageList();
</script>

<template>
  <a-space size="small">
    <a-button @click="modalVisible = true"> 选择图片… </a-button>
    <a-button type="text" status="danger" @click="handleReset">
      <template #icon>
        <icon-delete />
      </template>
    </a-button>
  </a-space>
  <a-modal
    unmount-on-close
    v-model:visible="modalVisible"
    title="选择背景图片"
    @close="modalVisible = false"
    @cancel="modalVisible = false"
    @ok="emit('value-change', selectedImage)"
  >
    <div class="flex flex-col gap-4">
      <div class="w-full flex gap-4">
        <a-input-group class="w-full">
          <a-input placeholder="搜索文件名" v-model="searchValue" allow-clear />
          <a-tooltip content="点击刷新图片列表">
            <a-button @click="getImageList" :loading="loadingState">
              <template #icon>
                <icon-refresh />
              </template>
            </a-button>
          </a-tooltip>
        </a-input-group>
        <a-button
          type="text"
          @click="handleOpenWindow('https://imgsearch.creamdd.pro/')"
          >模糊搜索…</a-button
        >
      </div>

      <div
        class="flex flex-wrap gap-4 justify-between max-h-[50vh] overflow-scroll"
        ref="imageContainerElement"
      >
        <a-spin v-if="loadingState" />
        <div
          class="image-container"
          v-for="image in imageList"
          :key="image.md5_hash"
          @click="selectedImage = image.filename"
          :class="{ selected: image.filename === selectedImage }"
        >
          <img
            class="object-cover rounded-md"
            :src="getImageUrl(image.filename)"
            loading="lazy"
          />
          <span class="rounded-md">{{ image.filename }}</span>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<style scoped lang="scss">
.image-container {
  display: grid;
  grid-template-areas:
    "image"
    "description";
  gap: 4px;
  grid-template-rows: 1fr auto;
  grid-template-columns: 148px;
  cursor: pointer;

  &.selected {
    img {
      width: 148px;
      border: 2px solid rgb(var(--arcoblue-6));
    }
    span {
      background-color: rgb(var(--arcoblue-6));
      padding: 0 4px;
      color: white;
    }
  }

  img {
    grid-row: 1/2;
  }

  span {
    grid-area: description;
    overflow: hidden;
    white-space: break-spaces;
    text-overflow: ellipsis;
    padding: 0 4px;
    font-weight: 500;
  }
}
</style>
