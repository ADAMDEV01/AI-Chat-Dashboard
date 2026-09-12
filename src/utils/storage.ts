import type { Conversation, Theme } from '../types'

const CONVERSATIONS_KEY = 'orbit-chat-conversations'
const THEME_KEY = 'orbit-chat-theme'

export function loadConversations(): Conversation[] | null {
  try {
    const value = window.localStorage.getItem(CONVERSATIONS_KEY)
    if (!value) return null
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return null
    return parsed as Conversation[]
  } catch {
    return null
  }
}

export function saveConversations(conversations: Conversation[]) {
  try {
    window.localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
  } catch {
    // Storage can be unavailable in privacy-restricted browsers.
  }
}

export function loadTheme(): Theme {
  try {
    const value = window.localStorage.getItem(THEME_KEY)
    return value === 'dark' || value === 'system' ? value : 'light'
  } catch {
    return 'light'
  }
}

export function saveTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Storage can be unavailable in privacy-restricted browsers.
  }
}

export function createId(prefix: string) {
  const random = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10)
  return `${prefix}-${random}`
}
