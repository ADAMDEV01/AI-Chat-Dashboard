import { useEffect, useMemo, useRef, useState } from 'react'
import { ChatWindow } from './components/ChatWindow'
import { Icon } from './components/Icon'
import { Sidebar } from './components/Sidebar'
import { initialConversations } from './data/initialConversations'
import { isAbortError, streamMockResponse } from './services/mockChat'
import { createId, loadConversations, loadTheme, saveConversations, saveTheme } from './utils/storage'
import type { Conversation, Message, Theme } from './types'

function getConversations() {
  return loadConversations() ?? initialConversations
}

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(getConversations)
  const [activeId, setActiveId] = useState(() => getConversations()[0]?.id ?? '')
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [theme, setTheme] = useState<Theme>(loadTheme)
  const [sending, setSending] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const activeIdRef = useRef(activeId)

  const activeConversation = conversations.find((conversation) => conversation.id === activeId) ?? conversations[0]
  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return conversations
    return conversations.filter((conversation) => conversation.title.toLowerCase().includes(query) || conversation.messages.some((message) => message.content.toLowerCase().includes(query)))
  }, [conversations, search])

  useEffect(() => { saveConversations(conversations) }, [conversations])
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      const resolvedTheme = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme
      document.documentElement.dataset.theme = resolvedTheme
    }
    applyTheme()
    media.addEventListener('change', applyTheme)
    saveTheme(theme)
    return () => media.removeEventListener('change', applyTheme)
  }, [theme])
  useEffect(() => { activeIdRef.current = activeId }, [activeId])
  useEffect(() => () => abortRef.current?.abort(), [])

  const updateConversation = (id: string, update: (conversation: Conversation) => Conversation) => {
    setConversations((current) => current.map((conversation) => conversation.id === id ? update(conversation) : conversation))
  }

  const createConversation = () => {
    abortRef.current?.abort()
    setSending(false)
    const conversation: Conversation = { id: createId('conversation'), title: 'New conversation', createdAt: Date.now(), messages: [], updatedAt: Date.now() }
    setConversations((current) => [conversation, ...current])
    setActiveId(conversation.id)
    setDraft('')
    setSidebarOpen(false)
  }

  const deleteConversation = (id: string) => {
    if (id === activeId) {
      abortRef.current?.abort()
      setSending(false)
    }
    if (conversations.length <= 1) {
      updateConversation(id, (conversation) => ({ ...conversation, title: 'New conversation', messages: [], updatedAt: Date.now() }))
      return
    }
    const remaining = conversations.filter((conversation) => conversation.id !== id)
    setConversations(remaining)
    if (id === activeId) setActiveId(remaining[0].id)
  }

  const renameConversation = (id: string, title: string) => updateConversation(id, (conversation) => ({ ...conversation, title, updatedAt: Date.now() }))
  const selectConversation = (id: string) => {
    if (id !== activeId) {
      abortRef.current?.abort()
      setSending(false)
    }
    setActiveId(id)
  }

  const sendMessage = async (providedContent?: string) => {
    const content = (providedContent ?? draft).trim()
    if (!content || sending || !activeConversation) return
    const conversationId = activeConversation.id
    const userMessage: Message = { id: createId('message'), role: 'user', content, createdAt: Date.now(), status: 'complete' }
    setDraft('')
    setSending(true)
    updateConversation(conversationId, (conversation) => ({
      ...conversation,
      title: conversation.messages.length === 0 ? content.slice(0, 34) + (content.length > 34 ? '…' : '') : conversation.title,
      messages: [...conversation.messages, userMessage],
      updatedAt: Date.now(),
    }))

    const controller = new AbortController()
    abortRef.current = controller
    const assistantId = createId('message')
    updateConversation(conversationId, (conversation) => ({ ...conversation, messages: [...conversation.messages, { id: assistantId, role: 'assistant', content: '', createdAt: Date.now(), status: 'sending' }] }))
    try {
      await streamMockResponse(content, controller.signal, (chunk) => {
        updateConversation(conversationId, (conversation) => ({
          ...conversation,
          messages: conversation.messages.map((message) => message.id === assistantId ? { ...message, content: message.content + chunk, status: 'sending' as const } : message),
          updatedAt: Date.now(),
        }))
      })
      updateConversation(conversationId, (conversation) => ({
        ...conversation,
        messages: conversation.messages.map((message) => message.id === assistantId ? { ...message, status: 'complete' as const } : message),
      }))
    } catch (error) {
      if (isAbortError(error)) {
        updateConversation(conversationId, (conversation) => ({ ...conversation, messages: conversation.messages.filter((message) => message.id !== assistantId), updatedAt: Date.now() }))
      } else {
        updateConversation(conversationId, (conversation) => ({
          ...conversation,
          messages: conversation.messages.map((message) => message.id === assistantId ? { ...message, content: 'I couldn’t complete that response. Please try again.', status: 'error' as const } : message),
          updatedAt: Date.now(),
        }))
      }
    } finally {
      if (activeIdRef.current === conversationId && abortRef.current === controller) setSending(false)
      if (abortRef.current === controller) abortRef.current = null
    }
  }

  const retryMessage = (errorMessage: Message) => {
    if (!activeConversation) return
    const previousUser = [...activeConversation.messages].reverse().find((message) => message.role === 'user' && message.createdAt < errorMessage.createdAt)
    if (!previousUser) return
    updateConversation(activeConversation.id, (conversation) => ({ ...conversation, messages: conversation.messages.filter((message) => message.id !== errorMessage.id) }))
    void sendMessage(previousUser.content)
  }

  return (
    <div className="app-shell">
      <button className={`mobile-overlay ${sidebarOpen ? 'visible' : ''}`} aria-label="Close menu" onClick={() => setSidebarOpen(false)} />
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar conversations={filteredConversations} activeId={activeConversation?.id ?? ''} search={search} onSearch={setSearch} onSelect={selectConversation} onNew={createConversation} onDelete={deleteConversation} onRename={renameConversation} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="content-shell">
        <div className="mobile-topbar">
          <button className="icon-button" onClick={() => setSidebarOpen(true)} aria-label="Open conversation menu"><Icon name="menu" /></button>
          <span className="mobile-brand"><span className="brand-mark"><Icon name="spark" size={15} /></span> orbit<span className="brand-accent">.</span></span>
          <button className="icon-button" onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')} aria-label={`Use ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} /></button>
        </div>
        {activeConversation ? <ChatWindow conversation={activeConversation} draft={draft} sending={sending} onDraftChange={setDraft} onSend={sendMessage} onStop={() => abortRef.current?.abort()} onRetry={retryMessage} /> : <div className="empty-state"><Icon name="spark" size={28} /><h2>Start a conversation</h2><button onClick={createConversation}>Create conversation</button></div>}
      </div>
      <button className="theme-toggle desktop-theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} /><span>{theme === 'light' ? 'Dark mode' : theme === 'dark' ? 'System theme' : 'Light mode'}</span></button>
    </div>
  )
}
