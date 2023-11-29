import axios from "axios";
import { Story } from "@/types/GameStoryEditor.ts";

const base = "https://api.blue-archive.io";

const api = axios.create({
  baseURL: base,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  timeoutErrorMessage: "请求超时",
});

// 获取列表
export async function getStoryList() {
  return await api.get(`/storys?t=${Date.now()}`).catch(e => {
    throw new Error(e);
  });
}

// 获取单个故事详情
export async function getStoryContent(uuid: string) {
  return await api.get(`/story/${uuid}?t=${Date.now()}`).catch(e => {
    throw new Error(e);
  });
}

// 更新故事详情
export async function updateStoryContent(uuid: string, content: Story) {
  return await api.put(`/story/${uuid}`, content).catch(e => {
    throw new Error(e);
  });
}

// 删除故事
export async function deleteStory(uuid: string) {
  return await api.delete(`/story/${uuid}`).catch(e => {
    throw new Error(e);
  });
}
