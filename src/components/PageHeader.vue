<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();

const currentRoute = computed(() => router.currentRoute.value.meta.title);
</script>

<template>
  <div class="header__container p-2 pl-[24px]">
    <div class="header__container__left flex gap-1">
      <a-button type="text" shape="circle">
        <template #icon>
          <icon-left size="20" />
        </template>
      </a-button>
      <h1 class="m-0">{{ currentRoute }}</h1>
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
