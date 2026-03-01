export type ExerciseMode = "logic" | "analytic" | "listening" | "italian"

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
  listening: [
    {
      id: "listen-1",
      question: "Listen and repeat: 'おはようございます' (Good morning)",
      questionJa: "聞いて繰り返してください：「おはようございます」",
      options: ["できました (Done)", "もう一度 (Again)"],
      correctIndex: 0,
      explanation: "Great job practicing!",
      explanationJa: "よくできました！",
    },
    {
      id: "listen-2",
      question: "Listen and repeat: 'お元気ですか' (How are you?)",
      questionJa: "聞いて繰り返してください：「お元気ですか」",
      options: ["できました (Done)", "もう一度 (Again)"],
      correctIndex: 0,
      explanation: "Excellent pronunciation practice!",
      explanationJa: "発音の練習、素晴らしいです！",
    },
  ],
  italian: [
    {
      id: "italian-1",
      question: "How do you say 'Hello' in Italian?",
      questionJa: "イタリア語で「こんにちは」は何と言いますか？",
      options: ["Ciao", "Grazie", "Arrivederci", "Prego"],
      correctIndex: 0,
      explanation: "'Ciao' means Hello (informal) in Italian.",
      explanationJa: "「Ciao」はイタリア語で「こんにちは」（カジュアル）です。",
    },
    {
      id: "italian-2",
      question: "How do you say 'Thank you' in Italian?",
      questionJa: "イタリア語で「ありがとう」は何と言いますか？",
      options: ["Ciao", "Grazie", "Buongiorno", "Scusa"],
      correctIndex: 1,
      explanation: "'Grazie' means Thank you in Italian.",
      explanationJa: "「Grazie」はイタリア語で「ありがとう」です。",
    },
    {
      id: "italian-3",
      question: "How do you say 'Good morning' in Italian?",
      questionJa: "イタリア語で「おはようございます」は何と言いますか？",
      options: ["Buonasera", "Buonanotte", "Buongiorno", "Ciao"],
      correctIndex: 2,
      explanation: "'Buongiorno' means Good morning in Italian.",
      explanationJa: "「Buongiorno」はイタリア語で「おはようございます」です。",
    },
  ],
}

export const MODE_INFO: Record<ExerciseMode, { icon: string; label: string; labelJa: string; color: string }> = {
  logic: { icon: "🧠", label: "Logic Q", labelJa: "論理問題", color: "#6366F1" },
  analytic: { icon: "📊", label: "Analytic Q", labelJa: "分析問題", color: "#8B5CF6" },
  listening: { icon: "👂", label: "Listening", labelJa: "リスニング", color: "#EC4899" },
  italian: { icon: "🇮🇹", label: "Italian", labelJa: "イタリア語", color: "#10B981" },
}
