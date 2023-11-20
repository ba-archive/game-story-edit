<script setup lang="ts">
import { useGameStoryEditorStore } from "@/store/store.ts";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storyType } from "@/types/GameStoryEditor.ts";

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
</script>

<template>
  <a-card class="shadow-sm" :bordered="false" :id="uuid">
    <a-space direction="vertical" size="medium" fill>
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
          <a-button type="primary" @click="goToEditor">前往编辑</a-button>
        </a-space>
      </div>
    </a-space>
  </a-card>
</template>

<style scoped lang="scss"></style>
