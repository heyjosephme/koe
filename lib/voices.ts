export interface Voice {
  id: string
  name: string
  nameJa: string
  type: "preset" | "custom"
}

export const VOICES: Voice[] = [
  // MiniMax preset voices
  { id: "male-qn-qingse", name: "Young Male", nameJa: "若い男性", type: "preset" },
  { id: "female-shaonv", name: "Young Female", nameJa: "若い女性", type: "preset" },
  { id: "male-qn-jingying", name: "Male Professional", nameJa: "男性（プロ）", type: "preset" },
  { id: "female-yujie", name: "Female Mature", nameJa: "女性（大人）", type: "preset" },
  { id: "presenter_male", name: "Male Presenter", nameJa: "男性アナウンサー", type: "preset" },
  { id: "presenter_female", name: "Female Presenter", nameJa: "女性アナウンサー", type: "preset" },
  {
  id: "custom_serjio_1772353671594",
  name: "Sergio",
  nameJa: "Sergioの声",
  type: "custom"
},

  // Add your custom cloned voices here:
  // { id: "your-cloned-voice-id", name: "Kenji's Voice", nameJa: "健二の声", type: "custom" },
]

export const DEFAULT_VOICE_ID = "male-qn-qingse"
