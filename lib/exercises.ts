export type ExerciseMode = "logic" | "analytic" | "language"

export interface Exercise {
  id: string
  question: string
  questionJa: string
  options: string[]
  correctIndex: number
  explanation: string
  explanationJa: string
}

export const EXERCISES: Record<ExerciseMode, Exercise[]> = {
  logic: [
    {
      id: "logic-1",
      question: "If all roses are flowers, and some flowers fade quickly, can we say all roses fade quickly?",
      questionJa: "すべてのバラは花です。一部の花はすぐに枯れます。すべてのバラはすぐに枯れると言えますか？",
      options: ["はい (Yes)", "いいえ (No)", "わからない (Cannot determine)"],
      correctIndex: 1,
      explanation: "No, because only 'some' flowers fade quickly, not all.",
      explanationJa: "いいえ。「一部の」花だけがすぐに枯れるので、すべてのバラがそうとは言えません。",
    },
    {
      id: "logic-2",
      question: "What comes next: 2, 4, 8, 16, ?",
      questionJa: "次の数字は何ですか：2, 4, 8, 16, ?",
      options: ["24", "32", "20", "18"],
      correctIndex: 1,
      explanation: "Each number doubles. 16 × 2 = 32",
      explanationJa: "各数字は2倍になります。16 × 2 = 32",
    },
    {
      id: "logic-3",
      question: "A is taller than B. C is shorter than B. Who is the shortest?",
      questionJa: "AはBより背が高い。CはBより背が低い。一番背が低いのは誰？",
      options: ["A", "B", "C"],
      correctIndex: 2,
      explanation: "A > B > C, so C is the shortest.",
      explanationJa: "A > B > C なので、Cが一番背が低いです。",
    },
  ],
  analytic: [
    {
      id: "analytic-1",
      question: "If you have 3 apples and give away 1, how many do you have?",
      questionJa: "りんごが3つあって、1つあげたら、いくつ残りますか？",
      options: ["1つ", "2つ", "3つ", "4つ"],
      correctIndex: 1,
      explanation: "3 - 1 = 2 apples remain.",
      explanationJa: "3 - 1 = 2つ残ります。",
    },
    {
      id: "analytic-2",
      question: "Which day comes after Wednesday?",
      questionJa: "水曜日の次の日は何曜日ですか？",
      options: ["火曜日", "木曜日", "金曜日", "月曜日"],
      correctIndex: 1,
      explanation: "Thursday comes after Wednesday.",
      explanationJa: "水曜日の次は木曜日です。",
    },
    {
      id: "analytic-3",
      question: "How many seasons are there in a year?",
      questionJa: "一年に季節はいくつありますか？",
      options: ["2つ", "3つ", "4つ", "5つ"],
      correctIndex: 2,
      explanation: "Spring, Summer, Fall, Winter - 4 seasons.",
      explanationJa: "春、夏、秋、冬の4つです。",
    },
  ],
  language: [
    {
      id: "lang-1",
      question: "How do you say 'Hello' in Italian?",
      questionJa: "イタリア語で「こんにちは」は何と言いますか？",
      options: ["Ciao", "Grazie", "Arrivederci", "Prego"],
      correctIndex: 0,
      explanation: "'Ciao' means Hello (informal) in Italian.",
      explanationJa: "「Ciao」はイタリア語で「こんにちは」（カジュアル）です。",
    },
    {
      id: "lang-2",
      question: "How do you say 'Thank you' in French?",
      questionJa: "フランス語で「ありがとう」は何と言いますか？",
      options: ["Merci", "Gracias", "Danke", "Prego"],
      correctIndex: 0,
      explanation: "'Merci' means Thank you in French.",
      explanationJa: "「Merci」はフランス語で「ありがとう」です。",
    },
    {
      id: "lang-3",
      question: "How do you say 'Good morning' in German?",
      questionJa: "ドイツ語で「おはようございます」は何と言いますか？",
      options: ["Guten Morgen", "Bonjour", "Buenos Días", "Ciao"],
      correctIndex: 0,
      explanation: "'Guten Morgen' means Good morning in German.",
      explanationJa: "「Guten Morgen」はドイツ語で「おはようございます」です。",
    },
  ],
}

export const MODE_INFO: Record<ExerciseMode, { icon: string; label: string; labelJa: string; color: string }> = {
  logic: { icon: "🧠", label: "Logic", labelJa: "論理問題", color: "#6366F1" },
  analytic: { icon: "📊", label: "Analytic", labelJa: "分析問題", color: "#8B5CF6" },
  language: { icon: "🌐", label: "Language", labelJa: "外国語", color: "#10B981" },
}
