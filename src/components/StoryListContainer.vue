<script setup lang="ts">
import { useGameStoryEditorStore } from "@/store/store.ts";
import { computed, onMounted, ref, watch } from "vue";
import EditorSidebar from "@components/EditorSidebar.vue";
import { useRouter } from "vue-router";
import StoryListCard from "@components/StoryListCard.vue";
import { Story, storyType } from "@/types/GameStoryEditor.ts";
import { Message } from "@arco-design/web-vue";
import { getStoryContent, getStoryList } from "@/helper/comm.ts";
import { eventSystem } from "@/eventSystem/eventSystem.ts";
import { uniq } from "lodash-es";

const router = useRouter();
const useStore = useGameStoryEditorStore();

const storyList = computed(() => useStore.getStoryList);

const newStorySerial = ref("");
const newStoryDescription = ref("");
const placeholderSerial = ref("剧情编号");
const placeholderDescription = ref("剧情概要");
const errorStatusSerial = ref(false);
const errorStatusDescription = ref(false);

const enum InputBlurType {
  Identifier,
  Description,
}

const selectedStoryType = ref(storyType[0].value);

function handleCreateNewStory(goToEditor = true) {
  if (newStorySerial.value === "") {
    errorStatusSerial.value = true;
    placeholderSerial.value = "编号不能为空";
    Message.error("编号不能为空");
    return;
  }
  const uuid = useStore.createNewStory(
    selectedStoryType.value + "_" + newStorySerial.value,
    newStoryDescription.value
  );
  if (!goToEditor) return;
  router.push({ name: "EditorMain", params: { uuid } });
}

function handleInputBlur(type: InputBlurType) {
  const errorMessage = "内容不能为空";
  switch (type) {
    case InputBlurType.Identifier:
      if (newStorySerial.value === "") {
        errorStatusSerial.value = true;
        placeholderSerial.value = errorMessage;
      } else {
        errorStatusSerial.value = false;
        placeholderSerial.value = "SS_001";
      }
      break;
    case InputBlurType.Description:
      if (newStoryDescription.value === "") {
        errorStatusDescription.value = true;
        placeholderDescription.value = errorMessage;
      } else {
        errorStatusDescription.value = false;
        placeholderDescription.value = "剧情概要";
      }
      break;
  }
}

const remoteList = ref([] as string[]);
const remoteStories = ref([] as Story[]);
const localList = ref([] as string[]);

function handleMerge() {
  const uniqList = uniq([...localList.value, ...remoteList.value]);
  const mergedStories = uniqList.map(uuid => {
    const localStory = useStore.getStoryByUuid(uuid);
    const remoteStory = remoteStories.value.find(
      story => story.uuid === uuid
    ) as Story;
    if (!localStory) {
      return remoteStory;
    }
    if (!remoteStory) {
      return localStory;
    }
    return remoteStory;
  });

  mergedStories.forEach(story => {
    useStore.overwriteStory(story, story.lastUpdated ?? 0);
  });
}

async function handleSync() {
  try {
    const response = await getStoryList();
    if (200 === response.status && response.data.data) {
      remoteList.value = response.data.data;
    }
  } catch (e) {
    Message.error("同步列表失败");
    return;
  }

  remoteStories.value = await Promise.all(
    remoteList.value.map(async uuid => {
      try {
        const response = await getStoryContent(uuid);
        if (200 === response.status && response.data.data) {
          return response.data.data;
        }
      } catch (e) {
        Message.error("同步故事信息失败：UUID " + uuid);
        return {
          uuid,
          serial: useStore.getStoryByUuid(uuid)?.serial ?? uuid,
          description: useStore.getStoryByUuid(uuid)?.description ?? "",
          tags: useStore.getStoryByUuid(uuid)?.tags ?? [],
          lastUpdated: useStore.getStoryByUuid(uuid)?.lastUpdated ?? 0,
        };
      }
    })
  );

  localList.value = useStore.getStoryList.map(story => story.uuid);

  useStore.updateRemoteStories(remoteStories.value);

  handleMerge();
}

eventSystem.on("sync-list", handleSync);

onMounted(() => {
  handleSync();
});

const sortType = ref("lastUpdated");

const sortTypes = [
  {
    label: "默认排序",
    value: "default",
  },
  {
    label: "按编号从小到大排序",
    value: "serial",
  },
  {
    label: "按更新时间从晚到早排序",
    value: "lastUpdated",
  },
];

const scrollContainer = ref<HTMLElement>();

const sortTypeString = computed(
  () =>
    sortTypes.find(item => item.value === sortType.value)?.label ?? "默认排序"
);

function handleChangeSortType(value: string) {
  sortType.value = value;
}

const storyListSorted = computed(() => {
  const list = [...storyList.value];
  switch (sortType.value) {
    case "default":
      return list;
    case "serial":
      return list.sort((a, b) => {
        const serialA = a.serial;
        const serialB = b.serial;
        if (serialA < serialB) {
          return -1;
        }
        if (serialA > serialB) {
          return 1;
        }
        return 0;
      });
    case "lastUpdated":
      return list.sort((a, b) => {
        const lastUpdatedA = a.lastUpdated;
        const lastUpdatedB = b.lastUpdated;
        if (lastUpdatedA < lastUpdatedB) {
          return 1;
        }
        if (lastUpdatedA > lastUpdatedB) {
          return -1;
        }
        return 0;
      });
    default:
      return list;
  }
});

const storyListFiltered = ref(storyListSorted.value);
const searchInput = ref("");

watch([searchInput, storyListSorted], ([searchInput, storyListSorted]) => {
  if (searchInput === "") {
    storyListFiltered.value = storyListSorted;
  }
  storyListFiltered.value = storyListSorted.filter(story => {
    const serial = story.serial;
    const description = story.description;
    const tags = story.tags.join(" ");
    return (
      serial.includes(searchInput) ||
      description.includes(searchInput) ||
      tags.includes(searchInput)
    );
  });
  eventSystem.emit("list-sorted", storyListFiltered.value);
});
</script>

<template>
  <div class="story-list-container flex-1">
    <editor-sidebar style="grid-area: sidebar" mode="storyList" />
    <div
      class="story-list flex flex-col justify-start gap-4"
      ref="scrollContainer"
    >
      <div class="sticky top-[-24px] flex justify-between z-10 shadow-y-upper">
        <a-input
          placeholder="搜索标题、概要和标签"
          v-model="searchInput"
          allow-clear
        >
          <template #prefix>
            <a-space size="small">
              <icon-search />
            </a-space>
          </template>
        </a-input>

        <a-dropdown trigger="hover">
          <a-button>
            <span>{{ sortTypeString }}</span>
            <template #icon>
              <icon-down />
            </template>
          </a-button>
          <template #content>
            <a-doption
              v-for="item in sortTypes"
              :key="item.value"
              :value="item.value"
              @click="handleChangeSortType(item.value)"
            >
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </div>

      <story-list-card
        v-for="story in storyListFiltered"
        :key="story.uuid"
        :uuid="story.uuid"
      />
      <a-divider />
      <a-card id="story-create-new-item" class="shadow-sm" :bordered="false">
        <a-space direction="vertical" size="medium" fill>
          <a-space direction="vertical" size="small" fill>
            <h2 class="m-0">剧情编号</h2>
            <a-input-group>
              <a-select
                v-model="selectedStoryType"
                :trigger-props="{ autoFitPopupMinWidth: true }"
              >
                <a-option
                  v-for="item in storyType"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </a-select>
              <a-input
                v-model="newStorySerial"
                allow-clear
                :placeholder="placeholderSerial"
                @blur="handleInputBlur(InputBlurType.Identifier)"
                :error="errorStatusSerial"
              />
            </a-input-group>
          </a-space>
          <a-space direction="vertical" size="small" fill>
            <h2 class="m-0">剧情概要</h2>
            <a-textarea
              v-model="newStoryDescription"
              allow-clear
              :max-length="{ length: 400, errorOnly: true }"
              show-word-limit
              auto-size
              :placeholder="placeholderDescription"
              @blur="handleInputBlur(InputBlurType.Description)"
              :error="errorStatusDescription"
            />
          </a-space>
          <a-space
            size="medium"
            class="flex w-full justify-end"
            full
            align="center"
          >
            <a-button @click="handleCreateNewStory(false)"> 新建剧情</a-button>
            <a-button type="primary" @click="handleCreateNewStory"
              >新建剧情并编辑
            </a-button>
          </a-space>
        </a-space>
      </a-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.story-list-container {
  display: grid;
  grid-template-areas: "sidebar main";
  grid-template-columns: 240px 1fr;

  &__content {
    &__header {
      $inner-width: 684px;
      padding: 24px calc((100% - #{$inner-width}) / 2);
    }
  }
}

.story-list {
  $inner-width: 684px;
  padding: 24px calc((100% - #{$inner-width}) / 2);
  overflow: scroll;
  height: calc(100vh - var(--header-height, 32px));

  &--title {
  }

  &.affixed {
    .story-list--title {
      .arco-input-wrapper {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
    }
  }
}
</style>
