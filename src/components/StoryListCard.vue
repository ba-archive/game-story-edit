<script setup lang="ts">
import { useGameStoryEditorStore } from "@/store/store.ts";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Story, storyType } from "@/types/GameStoryEditor.ts";
import { formatDate, getShanghaiDate } from "@/helper/date.ts";
import { useClipboard } from "@vueuse/core";
import { Message } from "@arco-design/web-vue";
import { getStoryContent } from "@/helper/comm.ts";

const { copy } = useClipboard({ legacy: true });

const router = useRouter();

const useStore = useGameStoryEditorStore();

const props = defineProps<{
  uuid: string;
}>();

const story = computed(() => useStore.getStoryByUuid(props.uuid));

const storySerialFull = ref(story.value?.serial ?? "MS_001");
const storyDescription = ref(story.value?.description ?? "");

function handleDeleteStory() {
  useStore.deleteStory(props.uuid);
}

function goToEditor() {
  router.push({ name: "EditorMain", params: { uuid: props.uuid } });
}

const selectedStoryType = ref(storySerialFull.value.slice(0, 2));
const storyNumberSerial = ref(storySerialFull.value.slice(3));
const tags = ref<string[]>(story.value?.tags ?? []);

watch(
  [selectedStoryType, storyNumberSerial, storyDescription, tags],
  ([newSelectedStoryType, newStoryNumberSerial, newStoryDescription, tags]) => {
    useStore.updateStoryMeta(
      props.uuid,
      newSelectedStoryType + "_" + newStoryNumberSerial,
      newStoryDescription,
      tags
    );
  },
  { deep: true }
);

function copyUuid() {
  copy(props.uuid).catch(() => {
    Message.error("复制 UUID 失败");
  });

  Message.success("复制 UUID 成功: " + props.uuid);
}

function getLastUpdated() {
  const lastUpdated = story.value?.lastUpdated ?? getShanghaiDate().valueOf();
  return formatDate(lastUpdated);
}

const remoteStory = ref<Story | {}>({});

async function handleSyncRemote(uuid: string) {
  try {
    const response = await getStoryContent(uuid);
    if (200 === response.status && response.data.data) {
      remoteStory.value = response.data.data;
    } else {
      throw new Error("同步故事信息失败：UUID " + uuid);
    }
  } catch (e) {
    Message.error("同步故事信息失败：UUID " + uuid);
    return {
      uuid,
      serial: useStore.getStoryByUuid(uuid)?.serial ?? uuid,
      description: useStore.getStoryByUuid(uuid)?.description ?? "",
      tags: useStore.getStoryByUuid(uuid)?.tags ?? [],
      lastUpdated: useStore.getStoryByUuid(uuid)?.lastUpdated ?? 0,
    };
  }
}
</script>

<template>
  <a-card class="shadow-sm" :bordered="false" :id="uuid">
    <a-space direction="vertical" size="medium" fill>
      <div class="flex w-full justify-between">
        <a-space direction="vertical" size="small" fill>
          <h2 class="m-0">剧情编号</h2>
          <a-input-group>
            <a-select
              v-model="selectedStoryType"
              :trigger-props="{ autoFitPopupMinWidth: true }"
            >
              <a-option
                v-for="item in storyType"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </a-select>
            <a-input
              allow-clear
              :placeholder="storyNumberSerial"
              v-model="storyNumberSerial"
            />
          </a-input-group>
        </a-space>
        <a-tag class="cursor-pointer" color="blue" @click="copyUuid"
          >最后更新：{{ getLastUpdated() }}</a-tag
        >
      </div>
      <a-space direction="vertical" size="small" fill>
        <h2 class="m-0">剧情概要</h2>
        <a-textarea
          allow-clear
          :max-length="{ length: 400, errorOnly: true }"
          show-word-limit
          auto-size
          v-model="storyDescription"
          :placeholder="storyDescription || '此段剧情暂无描述'"
        />
      </a-space>
      <div class="flex w-full justify-between items-end">
        <a-space size="small" direction="vertical">
          <a-tooltip :content="uuid" position="tl">
            <h1>标签</h1>
          </a-tooltip>
          <a-input-tag
            v-model="tags"
            size="small"
            :style="{ minWidth: '320px', flex: 1 }"
            allow-clear
          >
            <template #prefix>
              <icon-tag />
            </template>
          </a-input-tag>
        </a-space>
        <a-space size="medium">
          <a-popconfirm type="warning" ok-text="删除" @ok="handleDeleteStory()">
            <a-button type="text" status="danger">删除</a-button>
            <template #content>
              <div>你确定要删除吗？</div>
              <div>删除的内容无法恢复。</div>
            </template>
          </a-popconfirm>
          <a-dropdown-button
            type="primary"
            position="br"
            trigger="hover"
            @click="goToEditor"
          >
            前往编辑
            <template #content>
              <a-doption @click="handleSyncRemote(uuid)">
                <template #icon>
                  <icon-cloud-download />
                </template>
                <span>同步远程</span>
              </a-doption>
            </template>
          </a-dropdown-button>
        </a-space>
      </div>
    </a-space>
  </a-card>
</template>

<style scoped lang="scss"></style>
