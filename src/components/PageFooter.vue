<script setup lang="ts">
import { useGameStoryEditorStore } from '@/store/store';

const store = useGameStoryEditorStore();
</script>

<template>
<a-space class="p-4 bg-white shadow-y-upper" size="large" fill align="center" style="justify-content: center;">
  <a-space size="small">
    输出 RAW 文件
    <a-switch>
      <template #checked>
        开
      </template>
      <template #unchecked>
        关
      </template>
    </a-switch>
  </a-space>
<a-button type="primary">保存到本地</a-button>
<a-popconfirm type="warning" ok-text="清空">
  <a-button type="primary" status="danger">清空当前工作区</a-button>
  <template #content>
    <div>你确定要清空吗？</div>
    <div>清空的内容无法恢复。</div>
  </template>
</a-popconfirm>
</a-space>
</template>

<style scoped lang="scss">

</style>