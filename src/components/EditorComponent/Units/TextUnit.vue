<script setup lang="ts">
import { useGameStoryEditorStore } from "@/store/store.ts";
import { Character, StoryEditorTextUnit } from "@/types/GameStoryEditor.ts";
import { ref, watch } from "vue";
import BackgroundImageSelector from "@components/EditorComponent/Units/BackgroundImageSelector.vue";
import { getImageUrl } from "@/helper/image.ts";
import CharacterSelector from "@components/EditorComponent/Units/CharacterSelector.vue";
import BackgroundMusicSelector from "@components/EditorComponent/Units/BackgroundMusicSelector.vue";

const useStore = useGameStoryEditorStore();

const props = withDefaults(
  defineProps<{
    uuid: string;
    storyUnit: StoryEditorTextUnit;
  }>(),
  {
    uuid: "",
    storyUnit: {
      id: Date.now().valueOf(),
      type: "title",
      backgroundImage: "",
      bgm: "",
      text: "",
    },
  }
);

const currentStoryUnit = ref(props.storyUnit);

function handleImageSelect(imageUrl: string) {
  currentStoryUnit.value.backgroundImage = imageUrl;
}

function handleCharacterChange(characterList: Character[]) {
  currentStoryUnit.value.characters = characterList;
}

watch(
  () => currentStoryUnit.value,
  newValue => {
    useStore.updateStoryUnit(props.uuid, newValue.id, newValue);
  }
);
</script>

<template>
  <a-space size="medium" fill align="start">
    <a-space direction="vertical" size="medium">
      <a-space direction="vertical" size="small">
        <h1>说话人</h1>
        <a-input-group>
          <a-input
            allow-clear
            placeholder="说话人"
            v-model="currentStoryUnit.speaker"
          >
            <template #prefix>说话人</template>
          </a-input>
          <a-input
            allow-clear
            placeholder="所属"
            v-model="currentStoryUnit.affiliation"
          >
            <template #prefix>所属</template>
          </a-input>
        </a-input-group>
      </a-space>
      <a-space direction="vertical" size="small" fill class="w-full">
        <h1>文本</h1>
        <a-textarea
          allow-clear
          placeholder="文本"
          v-model="currentStoryUnit.text"
          :max-length="{ length: 400, errorOnly: true }"
          show-word-limit
          auto-size
        >
        </a-textarea>
      </a-space>

      <div class="w-full flex gap-4 justify-between">
        <div class="flex flex-col w-full gap-2">
          <h1>舞台人物</h1>
          <character-selector
            :uuid="uuid"
            :story-unit="storyUnit"
            @character-change="handleCharacterChange"
          />
        </div>
        <div class="flex flex-col w-full gap-2">
          <h1>背景</h1>
          <background-image-selector @value-change="handleImageSelect" />
        </div>
        <div class="flex flex-col w-full gap-2">
          <h1>背景音乐</h1>
          <background-music-selector
            @value-change=""
            :current-bgm="storyUnit.bgm ?? ''"
          />
        </div>
      </div>
    </a-space>

    <a-space
      v-if="0 !== currentStoryUnit.backgroundImage.length"
      direction="vertical"
      size="small"
    >
      <h1>背景预览（点击放大）</h1>
      <a-image
        :src="getImageUrl(currentStoryUnit.backgroundImage)"
        height="158"
        preview
      />
    </a-space>
  </a-space>
</template>

<style scoped lang="scss"></style>
