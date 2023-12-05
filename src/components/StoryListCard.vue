<script setup lang="ts">
import { useGameStoryEditorStore } from "@/store/store.ts";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Story, storyType } from "@/types/GameStoryEditor.ts";
import { formatDate, getShanghaiDate } from "@/helper/date.ts";
import { useClipboard } from "@vueuse/core";
import { Message } from "@arco-design/web-vue";
import {
  deleteStory,
  getStoryContent,
  updateStoryContent,
} from "@/helper/comm.ts";

const { copy } = useClipboard({ legacy: true });

const router = useRouter();

const useStore = useGameStoryEditorStore();

const props = defineProps<{
  uuid: string;
}>();

const story = computed(() => useStore.getStoryByUuid(props.uuid));

const storySerialFull = ref(story.value?.serial ?? "MS_001");
const storyDescription = ref(story.value?.description ?? "");

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

async function handlePullFromRemote(uuid: string) {
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

async function handlePushToRemote(uuid: string) {
  const storyContent = useStore.getStoryByUuid(uuid);
  if (!storyContent) return;
  storyContent.lastUpdated = getShanghaiDate().valueOf();
  try {
    const response = await updateStoryContent(uuid, storyContent);
    if (200 === response.status && response.data.data) {
      remoteStory.value = response.data.data;
      Message.success("同步故事信息成功：UUID " + uuid);
    } else {
      throw new Error("同步故事信息失败：UUID " + uuid);
    }
  } catch (e) {
    Message.error("同步故事信息失败：UUID " + uuid);
  }
}

const deleteDropdownVisible = ref(false);

async function handleDeleteStory(
  operation: "local" | "remote" | "both" = "local"
) {
  // useStore.deleteStory(props.uuid);
  if ("local" === operation || "both" === operation) {
    useStore.deleteStory(props.uuid);
    Message.success("删除本地存档成功：UUID " + props.uuid);
  }
  if ("remote" === operation || "both" === operation) {
    const response = await deleteStory(props.uuid);
    if (200 === response.status && response.data.data) {
      remoteStory.value = response.data.data;
      Message.success("删除远程信息成功：UUID " + props.uuid);
    } else {
      Message.error("删除远程信息失败：UUID " + props.uuid);
    }
  }

  deleteDropdownVisible.value = false;
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
          <a-dropdown position="br" :popup-visible="deleteDropdownVisible">
            <a-button
              type="text"
              status="danger"
              @click="deleteDropdownVisible = true"
            >
              删除
            </a-button>
            <template #content>
              <a-popconfirm
                type="warning"
                ok-text="删除"
                @ok="handleDeleteStory('local')"
                @cancel="deleteDropdownVisible = false"
              >
                <template #content>
                  <div>你确定要删除吗？</div>
                  <div>删除的内容无法恢复。</div>
                </template>
                <a-doption>
                  <template #icon>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 10V44H39V10H9Z"
                        fill="none"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M20 20V33"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M28 20V33"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4 10H44"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16 10L19.289 4H28.7771L32 10H16Z"
                        fill="none"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </template>
                  <span>删除本地存档</span>
                </a-doption>
              </a-popconfirm>
              <a-popconfirm
                type="warning"
                ok-text="删除"
                @ok="handleDeleteStory('remote')"
                @cancel="deleteDropdownVisible = false"
              >
                <template #content>
                  <div>你确定要删除吗？</div>
                  <div>删除的内容无法恢复。</div>
                </template>
                <a-doption>
                  <template #icon>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 33C8.66666 33 4 31.5 4 25.5C4 18.5 11 17 13 17C14 13.5 16 8 24 8C31 8 34 12 35 15.5C35 15.5 44 16.5 44 25C44 31 40 33 36 33"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M29 28L19 38"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M19 28L29 38"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </template>
                  <span>删除云端存档</span>
                </a-doption>
              </a-popconfirm>

              <a-popconfirm
                type="warning"
                ok-text="删除"
                @ok="handleDeleteStory('both')"
                @cancel="deleteDropdownVisible = false"
              >
                <template #content>
                  <div>你确定要删除吗？</div>
                  <div>删除的内容无法恢复。</div>
                </template>
                <a-doption>
                  <template #icon>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 33C8.66666 33 4 31.5 4 25.5C4 18.5 11 17 13 17C14 13.5 16 8 24 8C31 8 34 12 35 15.5C35 15.5 44 16.5 44 25C44 31 40 33 36 33"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M29 28L19 38"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M19 28L29 38"
                        stroke="#333"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </template>
                  <span>删除本地与云端</span>
                </a-doption>
              </a-popconfirm>
            </template>
          </a-dropdown>

          <a-dropdown-button
            type="primary"
            position="br"
            trigger="hover"
            @click="goToEditor"
          >
            前往编辑
            <template #content>
              <a-doption @click="handlePullFromRemote(uuid)">
                <template #icon>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.6777 20.271C7.27476 21.3181 4 25.2766 4 30C4 35.5228 8.47715 40 14 40C14.9474 40 15.864 39.8683 16.7325 39.6221"
                      stroke="#333"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M36.0547 20.271C40.4577 21.3181 43.7324 25.2766 43.7324 30C43.7324 35.5228 39.2553 40 33.7324 40C32.785 40 31.8684 39.8683 30.9999 39.6221"
                      stroke="#333"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M36 20C36 13.3726 30.6274 8 24 8C17.3726 8 12 13.3726 12 20"
                      stroke="#333"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17.0654 30.119L23.9999 37.0764L31.1318 30"
                      stroke="#333"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M24 20V33.5382"
                      stroke="#333"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </template>
                <span>从云端拉取</span>
              </a-doption>
              <a-doption @click="handlePushToRemote(uuid)">
                <template #icon>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.6777 20.271C7.27476 21.3181 4 25.2766 4 30C4 35.5228 8.47715 40 14 40C14.9474 40 15.864 39.8683 16.7325 39.6221"
                      stroke="#333"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M36.0547 20.271C40.4577 21.3181 43.7324 25.2766 43.7324 30C43.7324 35.5228 39.2553 40 33.7324 40C32.785 40 31.8684 39.8683 30.9999 39.6221"
                      stroke="#333"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M36 20C36 13.3726 30.6274 8 24 8C17.3726 8 12 13.3726 12 20"
                      stroke="#333"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M17.0654 27.8812L23.9999 20.9238L31.1318 28.0002"
                      stroke="#333"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M24 38.0001V24.4619"
                      stroke="#333"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </template>
                <span>上传至云端</span>
              </a-doption>
            </template>
          </a-dropdown-button>
        </a-space>
      </div>
    </a-space>
  </a-card>
</template>

<style scoped lang="scss"></style>
