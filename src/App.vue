<script setup lang="ts">
import PageFooter from '@components/PageFooter.vue'
import PageHeader from './components/PageHeader.vue';
</script>

<template>
  <div class="header bg-white shadow-sm">
    <page-header />
  </div>
  <page-footer class="footer" />
</template>

<style scoped lang="scss">
.header {
  grid-area: header;
}
.footer {
  grid-area: footer;
}
</style>
