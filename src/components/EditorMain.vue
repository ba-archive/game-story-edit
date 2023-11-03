<template>
  <div class="main-editor__container">
    <editor-sidebar class="sidebar" />
    <page-footer class="footer" />
  </div>
</template>

<script setup lang="ts">
import PageFooter from "./PageFooter.vue";
import EditorSidebar from "./EditorSidebar.vue";
</script>

<style scoped lang="scss">
.main-editor {
  &__container {
    flex: 1;

    display: grid;
    grid-template-areas:
      "sidebar main"
      "sidebar footer";
    grid-template-rows: 1fr min-content;
    grid-template-columns: 200px 1fr;
    gap: 16px;
  }
}

.footer {
  grid-area: footer;
}

.sidebar {
  grid-area: sidebar;
}
</style>
