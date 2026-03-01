import { NextRequest, NextResponse } from "next/server"

const API_BASE = "https://api.minimax.io/v1"

export async function POST(request: NextRequest) {
  try {
    const { text, kidName, history = [] } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    const apiKey = process.env.MINIMAX_API_KEY
    const groupId = process.env.MINIMAX_GROUP_ID

    if (!apiKey || !groupId) {
      return NextResponse.json(
        { error: "MiniMax API key or Group ID not configured" },
        { status: 500 }
      )
    }

    // 1. Generate response with LLM (OpenAI-compatible format)
    const systemPrompt = `あなたは${kidName}です。高齢の親と話している優しい子供として振る舞ってください。
日本語で温かく自然に話してください。返答は短く会話的に（1〜2文）。
親の一日や健康について心からの関心を示してください。`

    const chatResponse = await fetch(
      `${API_BASE}/text/chatcompletion_v2?GroupId=${groupId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "MiniMax-Text-01",
          messages: [
            { role: "system", content: systemPrompt },
            ...history.map((m: { role: string; content: string }) => ({
              role: m.role,
              content: m.content,
            })),
            { role: "user", content: text },
          ],
          max_tokens: 150,
          temperature: 0.8,
        }),
      }
    )

    if (!chatResponse.ok) {
      const error = await chatResponse.text()
      console.error("Chat error:", error)
      return NextResponse.json({ error: "Chat failed" }, { status: 500 })
    }

    const chatData = await chatResponse.json()
    console.log("MiniMax chat response:", JSON.stringify(chatData, null, 2))

    const replyText =
      chatData.reply ||
      chatData.choices?.[0]?.message?.content ||
      chatData.choices?.[0]?.text ||
      "すみません、聞き取れませんでした。"

    // 2. Convert response to speech
    const ttsResponse = await fetch(`${API_BASE}/t2a_v2?GroupId=${groupId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "speech-02-turbo",
        text: replyText,
        voice_setting: {
          voice_id: "male-qn-qingse", // Young male voice
          speed: 0.9,
          vol: 1.0,
          pitch: 0,
        },
        audio_setting: {
          format: "mp3",
          sample_rate: 32000,
        },
      }),
    })

    if (!ttsResponse.ok) {
      const error = await ttsResponse.text()
      console.error("TTS error:", error)
      // Return text only if TTS fails
      return NextResponse.json({ text: replyText, audio: null })
    }

    const ttsData = await ttsResponse.json()
    const audioBase64 = ttsData.data?.audio || ttsData.audio_file

    return NextResponse.json({
      text: replyText,
      audio: audioBase64,
    })
  } catch (error) {
    console.error("Voice chat error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
