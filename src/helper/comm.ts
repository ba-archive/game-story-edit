import axios from "axios";

const base = "https://api.blue-archive.io";

const api = axios.create({
  baseURL: base,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getStoryList() {
  return await api.get(`/storys?t=${Date.now()}`);
}
