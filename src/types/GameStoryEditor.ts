import { CreateArrayWithLengthX, NumericRange, TimeStamp } from "./Helper";

export interface Story {
  uuid: string;
  serial: string;
  description: string;
  content: StoryEditorTextUnit[];
}

export interface Character {
  name: string;
  position: 1 | 2 | 3 | 4 | 5;
  face: string;
  // 人物表情
  emotion?:
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
    | ""; // 无特殊表情
  // 人物动作
  action?:
    | "appear"
    | "disappear"
    | "disappearLeft"
    | "disappearRight"
    | "appearToLeft"
    | "appearToRight"
    | "hophop"
    | "greeting"
    | "shake"
    | "stiff"
    | "closeup"
    | "jump"
    | "falldownR"
    | "falldownL" // 区别在于第一下跌倒的方向
    | "hide"
    | "move" // 人物移动，具体位置从 actionArgs 里取
    | ""; // 无特殊动作
  actionArgs?: 1 | 2 | 3 | 4 | 5; // 行为参数，比如 move 的参数是 1-5 的数字
  filter:
    | "signal" // 全息特效
    | "";
}

export interface StoryEditorTextUnit {
  id: TimeStamp; // 直接用时间戳，不用自增
  type:
    | "title" // 标题
    | "place" // 场景 banner
    | "text" // 文字
    | "select" // 选项触发
    | "option" // 选项
    | "st" // 浮动文字
    | "effectOnly" // 仅特效
    | "continue"; // 显示待续画面
  backgroundImage: string; // 背景图，不需要后缀
  bgm: string; // BGM，不需要后缀
  speaker?: string; // 纯特效可以没有说话人
  affiliation?: string; // 没有说话人时可以没有所属
  selectionGroups?: SelectionGroup[]; // 选项触发
  text?: string; // 纯特效时可以没有文本
  characters?: Character[]; // 纯特效时可以没有人物
  command?: "smoke" | "shake" | "wait" | "trigger";
  // 还能扩展
  commandArgs?: (number | string | boolean)[]; // 命令参数，可能有多个，比如 trigger 的参数有 flagName，可选参数有 value
}

export interface SelectionGroup extends StoryEditorTextUnit {
  selectionGroup: NumericRange<CreateArrayWithLengthX<1>, 99>; // 1-99 的数字
  type: "option";
  condition?: [
    string,
    "Less" | "LessEqual" | "Equal" | "NotEqual" | "Greater" | "GreaterEqual",
    string | number | boolean,
  ]; // 条件参数，可能有多个，例: ["flagName", "GreaterEqual", 1]
}

export interface SidebarStoryListUnit {
  serial: string;
  uuid: string;
  description: string;
}

export interface SidebarStoryUnitListUnit extends StoryEditorTextUnit {}

export const storyType = [
  {
    label: "主线剧情",
    value: "MS",
  },
  {
    label: "支线剧情",
    value: "SS",
  },
  {
    label: "好感剧情",
    value: "FS",
  },
];

export const unitType = [
  {
    label: "标题",
    value: "title",
  },
  {
    label: "场景提示",
    value: "place",
  },
  {
    label: "文字",
    value: "text",
  },
  {
    label: "选项触发",
    value: "select",
  },
  {
    label: "选项",
    value: "option",
  },
  {
    label: "浮动文字",
    value: "st",
  },
  {
    label: "仅特效",
    value: "effectOnly",
  },
  {
    label: "待续",
    value: "continue",
  },
];

export const unitTypeWithoutOption = unitType.filter(
  unit => unit.value !== "option"
);

export const characterEmotions: Array<{
  label: Character["emotion"];
  value: Character["emotion"];
}> = [
  {
    label: "heart",
    value: "heart",
  },
  {
    label: "respond",
    value: "respond",
  },
  {
    label: "music",
    value: "music",
  },
  {
    label: "twinkle",
    value: "twinkle",
  },
  {
    label: "upset",
    value: "upset",
  },
  {
    label: "sweat",
    value: "sweat",
  },
  {
    label: "dot",
    value: "dot",
  },
  {
    label: "chat",
    value: "chat",
  },
  {
    label: "exclaim",
    value: "exclaim",
  },
  {
    label: "surprise",
    value: "surprise",
  },
  {
    label: "question",
    value: "question",
  },
  {
    label: "shy",
    value: "shy",
  },
  {
    label: "angry",
    value: "angry",
  },
  {
    label: "steam",
    value: "steam",
  },
  {
    label: "sigh",
    value: "sigh",
  },
  {
    label: "sad",
    value: "sad",
  },
  {
    label: "bulb",
    value: "bulb",
  },
  {
    label: "zzz",
    value: "zzz",
  },
  {
    label: "tear",
    value: "tear",
  },
];
