import { NumericRange, CreateArrayWithLengthX, TimeStamp } from "./Helper";

export interface Character {
  name: string;
  position: 1 | 2 | 3 | 4 | 5;
  face: string;
  action:
  | "heart"
  | "respond"
  | "music"
  | "twinkle"
  | "upset"
  | "sweat"
  | "dot"
  | "chat"
  | "exclaim"
  | "surprise"
  | "question"
  | "shy"
  | "angry"
  | "steam"
  | "sigh"
  | "sad"
  | "bulb"
  | "zzz"
  | "tear"
  | "disappear"
  | "hide"
  filter:
  | "signal"  // 全息特效
}

export interface StoryEditorTextUnit {
  id: TimeStamp;  // 直接用时间戳，不用自增
  type:
  | "title"       // 标题
  | "place"       // 场景 banner
  | "text"        // 文字
  | "select"      // 选项触发
  | "option"      // 选项
  | "st"          // 浮动文字
  | "effectOnly"  // 仅特效
  | "continue"    // 显示待续画面
  backgroundImage: string;
  bgmId: number;
  speaker?: string;
  affiliation?: string;
  selectionGroups?: SelectionGroup[];
  text?: string;
  characters?: Character[];
  command?:
  | "smoke"
  | "shake"
  | "wait"
  | "trigger"
  // 还能扩展
  commandArgs?: (number | string | boolean)[];
}

export interface SelectionGroup extends StoryEditorTextUnit {
  selectionGroup: NumericRange<CreateArrayWithLengthX<1>, 99>; // 1-99 的数字
  type: "option";
}
