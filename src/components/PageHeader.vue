<script setup lang="ts">

</script>

<template>
  <div class="header__container p-2 pl-[24px]">
    <div class="header__container__left">
      <h1>111</h1>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  &__container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;

    &__left {
    h1 {
      font-size: 1rem;
      font-weight: 600;
    }
  }
  }
}
</style>
