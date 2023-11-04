import {CreateArrayWithLengthX, NumericRange, TimeStamp} from "./Helper";

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
  action:
    ( // 人物表情
      "heart"
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
      // 人物行为
      | "appear"
      | "disappear"
      | "disappearLeft"
      | "disappearRight"
      | "appearToLeft"
      | "appearToRight"
      | "hophop"
      | "greeting"
      | "shake"
      | "move" // 人物移动，具体位置从 actionArgs 里取
      | "stiff"
      | "closeup"
      | "jump"
      | "falldownR"
      | "falldownL" // 区别在于第一下跌倒的方向
      | "hide"
      )[];
  actionArgs?: number | string | boolean; // 行为参数，比如 move 的参数是 1-5 的数字

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
  speaker?: string;                   // 纯特效可以没有说话人
  affiliation?: string;               // 没有说话人时可以没有所属
  selectionGroups?: SelectionGroup[]; // 选项触发
  text?: string;                      // 纯特效时可以没有文本
  characters?: Character[];           // 纯特效时可以没有人物
  command?:
    | "smoke"
    | "shake"
    | "wait"
    | "trigger"
  // 还能扩展
  commandArgs?: (number | string | boolean)[];    // 命令参数，可能有多个，比如 trigger 的参数有 flagName，可选参数有 value
}

export interface SelectionGroup extends StoryEditorTextUnit {
  selectionGroup: NumericRange<CreateArrayWithLengthX<1>, 99>; // 1-99 的数字
  type: "option";
  condition?: (string | number | boolean)[]; // 条件参数，可能有多个，比如 trigger
}

export interface SidebarStoryListUnit {
  serial: string;
  uuid: string;
  description: string;
}

export interface SidebarStoryUnitListUnit extends StoryEditorTextUnit {

}
