// MiniMax API client

const API_BASE = "https://api.minimax.io/v1"

export async function textToSpeech(
  text: string,
  voiceId = "female-tianmei-jingpin"
): Promise<ArrayBuffer> {
  const response = await fetch(`${API_BASE}/t2a_v2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      model: "speech-02-turbo",
      text,
      voice_setting: {
        voice_id: voiceId,
        speed: 1.0,
        vol: 1.0,
        pitch: 0,
      },
      audio_setting: {
        format: "mp3",
        sample_rate: 32000,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`MiniMax TTS error: ${error}`)
  }

  const data = await response.json()
  // Decode base64 audio
  const audioData = Uint8Array.from(atob(data.data.audio), c => c.charCodeAt(0))
  return audioData.buffer
}

export async function chatCompletion(
  messages: { role: string; content: string }[],
  kidName: string
): Promise<string> {
  const systemPrompt = `You are ${kidName}, a caring child talking to your elderly parent.
You speak warmly and naturally in Japanese. Keep responses short and conversational (1-2 sentences).
Show genuine interest in your parent's day and wellbeing.
If they mention health issues, respond with concern but stay positive.`

  const response = await fetch(`${API_BASE}/v1/text/chatcompletion_v2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      model: "abab6.5s-chat",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      max_tokens: 150,
      temperature: 0.8,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`MiniMax chat error: ${error}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}
