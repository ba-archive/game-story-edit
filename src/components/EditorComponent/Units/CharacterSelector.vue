<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios";
import { Message } from "@arco-design/web-vue";
import {
  characterActionsList,
  characterEmotionsList,
  StoryEditorTextUnit,
} from "@/types/GameStoryEditor";
import { getUuid } from "@/helper/getUuid.ts";

const modalVisible = ref(false);

export interface CharacterInfo {
  id: number;
  label: string;
  value: string;
}

const props = defineProps<{
  uuid: string;
  storyUnit: StoryEditorTextUnit;
}>();

const emit = defineEmits<{
  (event: "character-change", value: StoryEditorTextUnit["characters"]): void;
}>();

const characterList = ref<CharacterInfo[]>();
const isLoading = ref(true);
const currentCharacters = ref(props.storyUnit?.characters || []);

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

function handleAddNewCharacter() {
  if (currentCharacters.value.length >= 5) {
    Message.error("最多只能添加 5 个人物");
    return;
  }
  currentCharacters.value.push({
    uuid: getUuid(),
    name: "",
    position: 1,
    face: "00",
    emotion: "",
    action: "",
  });
}

function handleDeleteCharacter(uuid: string) {
  currentCharacters.value = currentCharacters.value.filter(
    character => character.uuid !== uuid
  );
}

function handleSearchKivoWikiRequest(name: string) {
  const character = characterList.value?.find(e => e.value === name);
  if (!character) return;
  window.open(
    `https://kivo.wiki/data/character/${character.id}?mode=appreciation`,
    "_blank",
    "noreferrer noopener"
  );
}

watch(
  () => currentCharacters.value,
  newValue => {
    emit("character-change", newValue);
  }
);
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
      <div
        class="flex gap-4 justify-between"
        v-for="character in currentCharacters"
      >
        <a-space size="small">
          <a-space direction="vertical" size="small">
            <h2>人物</h2>
            <a-select
              placeholder="选择人物"
              v-model="character.name"
              allow-search
              style="min-width: 220px"
              :options="characterList"
              :virtual-list-props="{ fixedSize: true }"
              :loading="isLoading"
            />
          </a-space>
          <a-space direction="vertical" size="small">
            <h2>位置</h2>
            <a-select
              placeholder="选择位置"
              v-model="character.position"
              :options="characterPositionList"
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
                <a-button
                  type="text"
                  class="ml-1"
                  size="mini"
                  @click="handleSearchKivoWikiRequest(character.name)"
                  >在古书馆查找
                </a-button>
              </a-tooltip>
            </h2>
            <a-input placeholder="输入…" v-model="character.face">
              <template #prefix>表情编号</template>
            </a-input>
          </a-space>
          <a-space direction="vertical" size="small">
            <h2>感情</h2>
            <a-select
              placeholder="选择…"
              v-model="character.emotion"
              style="width: 108px"
              allow-search
              allow-clear
              :options="characterEmotionsList"
              :virtual-list-props="{ fixedSize: true }"
            />
          </a-space>
          <a-space direction="vertical" size="small">
            <h2>动作</h2>
            <a-input-group>
              <a-select
                placeholder="选择…"
                v-model="character.action"
                style="width: 120px"
                allow-search
                allow-clear
                :options="characterActionsList"
                :virtual-list-props="{ fixedSize: true }"
              />
              <a-select
                v-if="'move' === character.action"
                placeholder="位置"
                v-model="character.actionArgs"
                :options="characterPositionList"
                style="width: 80px"
              />
            </a-input-group>
          </a-space>
        </a-space>
        <a-space direction="vertical" size="small">
          <h2>操作</h2>
          <a-button
            type="outline"
            status="danger"
            @click="handleDeleteCharacter(character.uuid)"
            >删除</a-button
          >
        </a-space>
      </div>
      <a-space size="medium">
        <a-button type="primary" @click="handleAddNewCharacter"
          >新增人物</a-button
        >
        <a-tooltip content="点击刷新可用人物列表">
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
