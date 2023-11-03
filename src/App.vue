<script setup lang="ts">
import PageHeader from './components/PageHeader.vue';
</script>

<template>
  <div class="header bg-white shadow-sm">
    <page-header />
  </div>
  <div class="main-view">
    <router-view></router-view>
  </div>
</template>

<style scoped lang="scss">
.header {
  grid-area: header;
  z-index: 999;
}

.main-view {
  grid-area: main;

  display: flex;
  flex-direction: column;
} 
</style>
