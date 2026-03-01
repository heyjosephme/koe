import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node"

const COLLECTION_NAME = "koe_conversations"

let client: MilvusClient | null = null

export function getZillizClient(): MilvusClient | null {
  if (!process.env.ZILLIZ_ENDPOINT || !process.env.ZILLIZ_TOKEN) {
    console.warn("Zilliz credentials not configured")
    return null
  }

  if (!client) {
    client = new MilvusClient({
      address: process.env.ZILLIZ_ENDPOINT,
      token: process.env.ZILLIZ_TOKEN,
    })
  }

  return client
}

export async function ensureCollection(): Promise<boolean> {
  const milvus = getZillizClient()
  if (!milvus) return false

  try {
    const exists = await milvus.hasCollection({ collection_name: COLLECTION_NAME })

    if (!exists.value) {
      await milvus.createCollection({
        collection_name: COLLECTION_NAME,
        fields: [
          { name: "id", data_type: DataType.VarChar, is_primary_key: true, max_length: 64 },
          { name: "kid_id", data_type: DataType.VarChar, max_length: 64 },
          { name: "role", data_type: DataType.VarChar, max_length: 16 },
          { name: "content", data_type: DataType.VarChar, max_length: 2048 },
          { name: "timestamp", data_type: DataType.Int64 },
          { name: "embedding", data_type: DataType.FloatVector, dim: 1536 },
        ],
      })

      await milvus.createIndex({
        collection_name: COLLECTION_NAME,
        field_name: "embedding",
        index_type: "AUTOINDEX",
        metric_type: "COSINE",
      })

      await milvus.loadCollection({ collection_name: COLLECTION_NAME })
    }

    return true
  } catch (error) {
    console.error("Failed to ensure collection:", error)
    return false
  }
}

export async function saveConversation(
  kidId: string,
  role: "user" | "assistant",
  content: string,
  embedding: number[]
): Promise<boolean> {
  const milvus = getZillizClient()
  if (!milvus) return false

  try {
    await ensureCollection()

    await milvus.insert({
      collection_name: COLLECTION_NAME,
      data: [
        {
          id: `${kidId}-${Date.now()}`,
          kid_id: kidId,
          role,
          content,
          timestamp: Date.now(),
          embedding,
        },
      ],
    })

    return true
  } catch (error) {
    console.error("Failed to save conversation:", error)
    return false
  }
}

export async function getRecentConversations(
  kidId: string,
  limit = 10
): Promise<{ role: string; content: string }[]> {
  const milvus = getZillizClient()
  if (!milvus) return []

  try {
    await ensureCollection()

    const results = await milvus.query({
      collection_name: COLLECTION_NAME,
      filter: `kid_id == "${kidId}"`,
      output_fields: ["role", "content", "timestamp"],
      limit,
    })

    // Sort by timestamp descending and return
    return (results.data || [])
      .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
      .slice(0, limit)
      .reverse()
      .map((r) => ({ role: r.role as string, content: r.content as string }))
  } catch (error) {
    console.error("Failed to get conversations:", error)
    return []
  }
}

export async function searchSimilarConversations(
  kidId: string,
  embedding: number[],
  limit = 5
): Promise<{ role: string; content: string; score: number }[]> {
  const milvus = getZillizClient()
  if (!milvus) return []

  try {
    await ensureCollection()

    const results = await milvus.search({
      collection_name: COLLECTION_NAME,
      vector: embedding,
      filter: `kid_id == "${kidId}"`,
      output_fields: ["role", "content"],
      limit,
    })

    return (results.results || []).map((r) => ({
      role: r.role as string,
      content: r.content as string,
      score: r.score,
    }))
  } catch (error) {
    console.error("Failed to search conversations:", error)
    return []
  }
}

// Simple embedding generation (placeholder - use MiniMax embeddings in production)
export function generateSimpleEmbedding(text: string): number[] {
  // Create a simple hash-based embedding for demo
  // In production, use MiniMax's embedding API
  const embedding = new Array(1536).fill(0)
  for (let i = 0; i < text.length; i++) {
    embedding[i % 1536] += text.charCodeAt(i) / 1000
  }
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return embedding.map((val) => val / (magnitude || 1))
}
