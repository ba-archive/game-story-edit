<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed } from "vue";
import { events } from "@/eventSystem/eventSystem.ts";

const router = useRouter();

const currentRoute = computed(() => router.currentRoute.value.meta.title);

const isHomeRoute = computed(
  () => router.currentRoute.value.name === "EditorHome"
);

function handleBackToHome() {
  router.push({ name: "EditorHome" });
}

function handleSyncButtonClick() {
  events.emit("sync-list");
}
</script>

<template>
  <div class="header__container p-2 pl-[24px]">
    <div class="header__container__left flex gap-1 items-center justify-start">
      <a-button
        type="text"
        shape="circle"
        v-if="!isHomeRoute"
        @click="handleBackToHome"
      >
        <template #icon>
          <icon-left size="20" />
        </template>
      </a-button>
      <h1 class="m-0">{{ currentRoute }}</h1>
    </div>
    <div
      class="header__container__center flex gap-1 items-center justify-center"
      v-if="isHomeRoute"
    >
      <a-tooltip mini content="同步">
        <a-button type="text" shape="circle" @click="handleSyncButtonClick">
          <template #icon>
            <icon-sync />
          </template>
        </a-button>
      </a-tooltip>
    </div>
    <div
      class="header__container__right flex gap-1 items-center justify-end"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.header {
  &__container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;

    &__left {
      .icon-back-container {
        margin-right: 8px;
        cursor: pointer;

        &:hover {
          background-color: var(--color-neutral-3);
        }
      }

      h1 {
        font-size: 1.25rem;
        line-height: 32px;
        font-weight: 600;
      }
    }
  }
}
</style>
