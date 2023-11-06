import { CreateArrayWithLengthX, NumericRange, TimeStamp } from "./Helper";

export interface Story {
  uuid: string;
  serial: string;
  description: string;
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
    | "bgm" // BGM
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
  command?:
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
    label: "场景特效或指令",
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
