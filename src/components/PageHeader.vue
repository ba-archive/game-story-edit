<script setup lang="ts">

</script>

<template>
  <div class="header__container p-2 pl-[24px]">
    <div class="header__container__left">
      <div class="icon-back-container p-1 rounded-sm">
        <icon-left size="20" />
      </div>
      <h1 class="m-0">111</h1>
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
      display: flex;
      align-items: center;

      .icon-back-container {
        margin-right: 8px;
        cursor: pointer;

        &:hover {
          background-color: var(--color-neutral-3);
        }
      }

      h1 {
        font-size: 1.25rem;
        font-weight: 600;
      }
    }
  }
}
</style>
