<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { StoryEditorTextUnit } from "@/types/GameStoryEditor";
import BackgroundImageSelector from "@components/EditorComponent/Units/BackgroundImageSelector.vue";
import { getImageUrl } from "@/helper/image.ts";
import BackgroundMusicSelector from "@components/EditorComponent/Units/BackgroundMusicSelector.vue";
import { getShanghaiDate } from "@/helper/date.ts";

const props = withDefaults(
  defineProps<{
    uuid: string;
    storyUnit: StoryEditorTextUnit;
  }>(),
  {
    uuid: "",
    storyUnit: {
      // @ts-ignore
      id: getShanghaiDate().valueOf(),
      type: "title",
      backgroundImage: "",
      bgm: "",
      text: "",
    },
  }
);

const emit = defineEmits<{
  (event: "value-change", value: StoryEditorTextUnit): void;
}>();

const currentStoryUnit = computed({
  get: () => props.storyUnit,
  set: newValue => {
    emit("value-change", newValue);
  },
});

const subTitle = ref(currentStoryUnit.value?.text?.split(";")[0] || "");
const mainTitle = ref(currentStoryUnit.value?.text?.split(";")[1] || "");

watch(
  () => [subTitle.value, mainTitle.value],
  () => {
    currentStoryUnit.value.text = `${subTitle.value};${mainTitle.value}`;
  }
);

function handleImageSelect(imageUrl: string) {
  currentStoryUnit.value.backgroundImage = imageUrl;
}

function handleBgmSelect(bgm: string) {
  currentStoryUnit.value.bgm = bgm;
}
</script>

<template>
  <a-space direction="horizontal" size="medium" fill align="start">
    <a-space direction="vertical" size="medium">
      <a-space direction="vertical" size="small">
        <h1>标题内容</h1>
        <a-input-group>
          <a-input allow-clear placeholder="小标题内容" v-model="subTitle">
            <template #prefix>小标题</template>
          </a-input>
          <a-input allow-clear placeholder="大标题内容" v-model="mainTitle">
            <template #prefix>大标题</template>
          </a-input>
        </a-input-group>
      </a-space>
      <a-space direction="horizontal" size="medium">
        <a-space direction="vertical" size="small">
          <h1>背景</h1>
          <background-image-selector @value-change="handleImageSelect" />
        </a-space>
        <a-space direction="vertical" size="small">
          <h1>背景音乐</h1>
          <background-music-selector
            :current-bgm="currentStoryUnit.bgm"
            @value-change="handleBgmSelect"
          />
        </a-space>
      </a-space>
    </a-space>
    <a-space
      v-if="0 !== currentStoryUnit.backgroundImage.length"
      direction="vertical"
      size="small"
    >
      <h1>背景预览（点击放大）</h1>
      <a-image
        :src="getImageUrl(currentStoryUnit.backgroundImage)"
        height="109"
      />
    </a-space>
  </a-space>
</template>

<style scoped lang="scss"></style>
