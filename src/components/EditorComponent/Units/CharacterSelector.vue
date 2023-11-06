<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { Message } from "@arco-design/web-vue";
import { useGameStoryEditorStore } from "@/store/store.ts";

const useStore = useGameStoryEditorStore();

const modalVisible = ref(false);

export interface CharacterInfo {
  id: number;
  label: string;
  value: string;
}

const characterList = ref<CharacterInfo[]>();
const isLoading = ref(true);

const characterPositionList = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 4,
    label: "4",
  },
  {
    value: 5,
    label: "5",
  },
];

function getCharacterList() {
  axios.get("/character_list.json").then(res => {
    if (200 !== res.status) {
      Message.error("人物列表获取失败");
    }
    characterList.value = res.data.index as CharacterInfo[];
    isLoading.value = false;
  });
}
function handleReset() {}

getCharacterList();
</script>

<template>
  <a-space size="small">
    <a-button @click="modalVisible = true">选择人物…</a-button>
    <a-button @click="handleReset" type="text" status="danger">
      <template #icon>
        <icon-delete />
      </template>
    </a-button>
  </a-space>
  <a-modal
    v-model:visible="modalVisible"
    title="选择人物"
    @close="modalVisible = false"
    @cancel="modalVisible = false"
    width="auto"
    unmount-on-close
  >
    <a-space direction="vertical" size="medium">
      <!--人物循环开始-->
      <a-space size="small">
        <a-space direction="vertical" size="small">
          <h2>人物</h2>
          <a-select
            placeholder="选择人物"
            allow-search
            style="width: 198px"
            :options="characterList"
            :virtual-list-props="{ fixedSize: true }"
            :loading="isLoading"
          />
        </a-space>
        <a-space direction="vertical" size="small">
          <h2>位置</h2>
          <a-select
            :options="characterPositionList"
            placeholder="选择位置"
            allow-search
            style="width: 60px"
          >
          </a-select>
        </a-space>
        <a-space direction="vertical" size="small">
          <h2>
            面部
            <a-tooltip>
              <template #content>
                <div>Spine 小人中人物的面部表情编号。</div>
              </template>
              <icon-question-circle class="cursor-pointer" />
              <a-button type="text" class="ml-1" size="mini"
                >在古书馆查找</a-button
              >
            </a-tooltip>
          </h2>
          <a-input placeholder="输入…">
            <template #prefix>表情编号</template>
          </a-input>
        </a-space>
        <a-space direction="vertical" size="small">
          <h2>感情</h2>
          <a-select placeholder="选择…" allow-search />
        </a-space>
        <a-space direction="vertical" size="small">
          <h2>动作</h2>
          <a-input-group>
            <a-select placeholder="选择…" allow-search />
          </a-input-group>
        </a-space>
        <a-space direction="vertical" size="small">
          <h2>操作</h2>
          <a-button type="outline" status="danger">删除</a-button>
        </a-space>
      </a-space>
      <a-space size="medium">
        <a-button type="primary">新增人物</a-button>
        <a-tooltip content="点击刷新人物列表">
          <a-button type="text">
            <template #icon>
              <icon-refresh />
            </template>
          </a-button>
        </a-tooltip>
      </a-space>
    </a-space>
  </a-modal>
</template>

<style scoped lang="scss"></style>
