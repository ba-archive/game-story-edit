import { TimeStamp } from "./Helper";

export enum StoryStatus {
  working,
  finished,
}

export interface Story {
  uuid: string;
  serial: string;
  lastUpdated: TimeStamp;
  status: StoryStatus;
  description: string;
  tags: string[];
  content: StoryEditorTextUnit[];
}

export interface Character {
  uuid: string;
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
  filter?:
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
  selectionGroups?: SelectionGroup[]; // 选项组，只有选项触发时才有
  text?: string; // 纯特效时可以没有文本
  characters?: Character[]; // 纯特效时可以没有人物
  command?:
    | "wait" // 等待
    | "setFlag" // 触发 flag
    | "manipulateFlag" // 操作 flag
    | "clearST" // 隐藏对话框，直到下一个文本单元出现时再显示
    | "hideAll" // 隐藏所有人物
    | "bgShake" // 背景震动
    | "popupFile" // 弹出图片
    | "BG_Filter_Red" // 红色滤镜
    | "BG_Wave_F"
    | "BG_Flash" // 强光
    | "BG_UnderFire_R" // 扫射从左到右
    | "BG_Love_L" // 爱心背景
    | "BG_Rain_L" // 下雨
    | "BG_UnderFire" // 扫射从右到左
    | "BG_SandStorm_L" // 沙尘环境
    | ""
    | "BG_Shining_L" // 闪闪发光
    | "BG_Dust_L" // 爆炸烟尘
    | "BG_Flash_Sound" // 闪光弹爆炸
    | "BG_FocusLine" // 聚焦线
    | "BG_Ash_Red" // 火星
    | "BG_Snow_L"; // 下雪
  commandArgs?: (number | string | boolean)[]; // 命令参数，可能有多个，比如 trigger 的参数有 flagName，可选参数有 value
  script: string;
}

export interface SelectionGroup {
  id: TimeStamp; // 精确到毫秒级别的时间戳在这里已经足够
  type: "option";
  text: string; // 选项文本
  isConditional: boolean; // 是否有条件
  condition?: [
    string,
    "Less" | "LessEqual" | "Equal" | "NotEqual" | "Greater" | "GreaterEqual",
    string,
  ]; // 条件参数，可能有多个，例: ["flagName", "GreaterEqual", 1]
  content: StoryEditorTextUnit[]; // 当满足条件时显示的对话内容
  script: string;
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
    description: "故事的标题。每段故事只能存在至多一个",
  },
  {
    label: "场景提示",
    value: "place",
    description: "以横幅形式出现在画面左上角的地点提示",
  },
  {
    label: "对话",
    value: "text",
    description: "显示在屏幕下方的对话内容",
  },
  {
    label: "玩家选项",
    value: "select",
    description: "玩家可以在对话中做出的选择",
  },
  {
    label: "浮动文字",
    value: "st",
    description: "它是文字，但是会出现在屏幕任何一个地方",
  },
  {
    label: "场景特效或指令",
    value: "effectOnly",
    description:
      "显示在屏幕上的特效（火星、烟尘等），或者需要发送给事件系统的指令",
  },
  {
    label: "待续",
    value: "continue",
    description: "显示to be continued画面",
  },
];

export const unitTypeWithoutOption = unitType.filter(
  unit => unit.value !== "option"
);

export const unitTypeInSelectionGroup = unitType.filter(
  unit =>
    unit.value !== "select" &&
    unit.value !== "option" &&
    unit.value !== "continue" &&
    unit.value !== "title"
);

export const characterEmotionsList: Array<{
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

export const characterActionsList: Array<{
  label: string;
  value: Character["action"];
}> = [
  {
    label: "出现",
    value: "appear",
  },
  {
    label: "消失",
    value: "disappear",
  },
  {
    label: "从左侧离开",
    value: "disappearLeft",
  },
  {
    label: "从右侧离开",
    value: "disappearRight",
  },
  {
    label: "从右侧进入",
    value: "appearToLeft",
  },
  {
    label: "从左侧进入",
    value: "appearToRight",
  },
  {
    label: "跳两下",
    value: "hophop",
  },
  {
    label: "屈膝礼",
    value: "greeting",
  },
  {
    label: "摇晃",
    value: "shake",
  },
  {
    label: "颤抖",
    value: "stiff",
  },
  {
    label: "靠近",
    value: "closeup",
  },
  {
    label: "跳一下",
    value: "jump",
  },
  {
    label: "向右倒下",
    value: "falldownR",
  },
  {
    label: "向左倒下",
    value: "falldownL",
  },
  {
    label: "隐藏",
    value: "hide",
  },
  {
    label: "移动",
    value: "move",
  },
];

export const commandList = [
  {
    label: "等待",
    value: "wait",
  },
  {
    label: "设置 flag",
    value: "setFlag",
  },
  {
    label: "更改 flag 值",
    value: "manipulateFlag",
  },
  {
    label: "隐藏对话框",
    value: "clearST",
  },
  {
    label: "隐藏所有人物",
    value: "hideAll",
  },
  {
    label: "背景震动",
    value: "bgShake",
  },
  {
    label: "弹出图片",
    value: "popupFile",
  },
  {
    label: "红色滤镜",
    value: "BG_Filter_Red",
  },
  {
    label: "波纹特效",
    value: "BG_Wave_F",
  },
  {
    label: "强光",
    value: "BG_Flash",
  },
  {
    label: "扫射从左到右",
    value: "BG_UnderFire_R",
  },
  {
    label: "爱心背景",
    value: "BG_Love_L",
  },
  {
    label: "下雨",
    value: "BG_Rain_L",
  },
  {
    label: "扫射从右到左",
    value: "BG_UnderFire",
  },
  {
    label: "沙尘环境",
    value: "BG_SandStorm_L",
  },
  {
    label: "闪闪发光",
    value: "BG_Shining_L",
  },
  {
    label: "爆炸烟尘",
    value: "BG_Dust_L",
  },
  {
    label: "闪光弹爆炸",
    value: "BG_Flash_Sound",
  },
  {
    label: "聚焦线",
    value: "BG_FocusLine",
  },
  {
    label: "火星",
    value: "BG_Ash_Red",
  },
  {
    label: "下雪",
    value: "BG_Snow_L",
  },
];

export const flagManipulateList = [
  {
    label: "增加",
    value: "add",
  },
  {
    label: "减少",
    value: "subtract",
  },
  {
    label: "设置为相反值",
    value: "setOpposite",
  },
];

export const flagConditionList = [
  {
    label: "小于",
    value: "Less",
  },
  {
    label: "小于等于",
    value: "LessEqual",
  },
  {
    label: "等于",
    value: "Equal",
  },
  {
    label: "不等于",
    value: "NotEqual",
  },
  {
    label: "大于",
    value: "Greater",
  },
  {
    label: "大于等于",
    value: "GreaterEqual",
  },
];

export interface BgmInfo {
  filename: string;
  format: "mp3";
  md5_hash: string;
}

export interface ImageInfo {
  filename: string;
  format: "jpg";
  md5_hash: string;
}
