export interface Character {
  
}

export interface StoryEditorTextUnit {
  type:
    | "title"
    | "place"
    | "text"
    | "option"
    | "st"
    | "effectOnly"
    | "continue"
  backgroundImage: string;
  bgmId: number;
  speaker: string;
  affiliation: string;
  text: string;
  characters: Character[];
  environmentFx: "";
}

export interface StoryEditorSelectionUnit {}
