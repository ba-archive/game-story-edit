import { saveAs } from "file-saver";

export function saveFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveAs(blob, fileName);
}
