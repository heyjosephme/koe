/**
 * Voice Cloning Script for MiniMax
 *
 * Usage:
 *   node scripts/clone-voice.mjs <audio-file-path> <voice-name>
 *
 * Example:
 *   node scripts/clone-voice.mjs ./kenji-voice.mp3 "Kenji"
 */

import fs from "fs"
import path from "path"

const API_BASE = "https://api.minimax.io/v1"

async function cloneVoice(audioPath, voiceName) {
  const apiKey = process.env.MINIMAX_API_KEY
  const groupId = process.env.MINIMAX_GROUP_ID

  if (!apiKey || !groupId) {
    console.error("❌ Missing MINIMAX_API_KEY or MINIMAX_GROUP_ID")
    console.log("Run: export MINIMAX_API_KEY=your_key")
    console.log("Run: export MINIMAX_GROUP_ID=your_group_id")
    process.exit(1)
  }

  console.log(`\n🎤 Cloning voice from: ${audioPath}`)
  console.log(`📛 Voice name: ${voiceName}\n`)

  // Step 1: Upload audio file
  console.log("Step 1: Uploading audio file...")

  const audioBuffer = fs.readFileSync(audioPath)
  const fileName = path.basename(audioPath)

  const formData = new FormData()
  formData.append("file", new Blob([audioBuffer]), fileName)
  formData.append("purpose", "voice_clone")

  const uploadResponse = await fetch(
    `${API_BASE}/files/upload?GroupId=${groupId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    }
  )

  if (!uploadResponse.ok) {
    const error = await uploadResponse.text()
    console.error("❌ Upload failed:", error)
    process.exit(1)
  }

  const uploadData = await uploadResponse.json()
  console.log("Upload response:", JSON.stringify(uploadData, null, 2))

  const fileId = uploadData.file?.file_id || uploadData.file_id
  if (!fileId) {
    console.error("❌ No file_id in response")
    process.exit(1)
  }
  console.log("✅ File uploaded, file_id:", fileId)

  // Step 2: Clone voice
  console.log("\nStep 2: Cloning voice...")

  const voiceId = `custom_${voiceName.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`

  const cloneResponse = await fetch(
    `${API_BASE}/voice_clone?GroupId=${groupId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        file_id: fileId,
        voice_id: voiceId,
      }),
    }
  )

  if (!cloneResponse.ok) {
    const error = await cloneResponse.text()
    console.error("❌ Clone failed:", error)
    process.exit(1)
  }

  const cloneData = await cloneResponse.json()
  console.log("Clone response:", JSON.stringify(cloneData, null, 2))

  console.log("\n" + "=".repeat(50))
  console.log("🎉 SUCCESS! Add this to lib/voices.ts:")
  console.log("=".repeat(50))
  console.log(`
{
  id: "${voiceId}",
  name: "${voiceName}",
  nameJa: "${voiceName}の声",
  type: "custom"
},
`)
  console.log("=".repeat(50) + "\n")
}

// Main
const args = process.argv.slice(2)
if (args.length < 2) {
  console.log("Usage: node scripts/clone-voice.mjs <audio-file> <voice-name>")
  console.log("Example: node scripts/clone-voice.mjs ./kenji.mp3 Kenji")
  process.exit(1)
}

cloneVoice(args[0], args[1])
