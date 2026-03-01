import type { Kid } from "./types"

const STORAGE_KEY = "koe-kids"

export function getKids(): Kid[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveKid(kid: Kid): void {
  const kids = getKids()
  kids.push(kid)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(kids))
}

export function getKid(id: string): Kid | undefined {
  return getKids().find((k) => k.id === id)
}
