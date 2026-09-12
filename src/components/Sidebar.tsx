import { useState } from 'react'
import type { Conversation } from '../types'
import { Icon } from './Icon'

interface SidebarProps {
  conversations: Conversation[]
  activeId: string
  search: string
  onSearch: (value: string) => void
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
  onClose?: () => void
}

export function Sidebar({ conversations, activeId, search, onSearch, onSelect, onNew, onDelete, onRename, onClose }: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState('')

  const beginRename = (conversation: Conversation) => {
    setEditingId(conversation.id)
    setDraftTitle(conversation.title)
  }

  const saveRename = () => {
    if (editingId && draftTitle.trim()) onRename(editingId, draftTitle.trim())
    setEditingId(null)
  }

  return (
    <aside className="sidebar" aria-label="Conversation history">
      <div className="sidebar-header">
        <a className="brand" href="#" aria-label="Orbit Chat home" onClick={(event) => { event.preventDefault(); onNew() }}>
          <span className="brand-mark"><Icon name="spark" size={17} /></span>
          <span>orbit<span className="brand-accent">.</span></span>
        </a>
        {onClose && <button className="icon-button mobile-only" onClick={onClose} aria-label="Close conversation menu"><Icon name="close" /></button>}
      </div>

      <button className="new-chat-button" onClick={onNew}><Icon name="plus" size={17} /> New conversation <span className="shortcut">⌘ K</span></button>

      <label className="search-box">
        <Icon name="search" size={16} />
        <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search conversations" aria-label="Search conversations" />
        {search && <button className="clear-search" onClick={() => onSearch('')} aria-label="Clear search"><Icon name="close" size={14} /></button>}
      </label>

      <div className="conversation-section">
        <p className="section-label">Your conversations</p>
        <nav className="conversation-list" aria-label="Your conversations">
          {conversations.length === 0 && <p className="empty-search">No conversations found.</p>}
          {conversations.map((conversation) => (
            <div className={`conversation-row ${activeId === conversation.id ? 'active' : ''}`} key={conversation.id}>
              {editingId === conversation.id ? (
                <input
                  className="rename-input"
                  value={draftTitle}
                  autoFocus
                  onChange={(event) => setDraftTitle(event.target.value)}
                  onBlur={saveRename}
                  onKeyDown={(event) => { if (event.key === 'Enter') saveRename(); if (event.key === 'Escape') setEditingId(null) }}
                  aria-label="Conversation title"
                />
              ) : (
                <button className="conversation-button" onClick={() => { onSelect(conversation.id); onClose?.() }}>
                  <span className="conversation-icon"><Icon name="spark" size={14} /></span>
                  <span className="conversation-title">{conversation.title}</span>
                </button>
              )}
              <div className="conversation-actions">
                <button className="row-action" onClick={() => beginRename(conversation)} aria-label={`Rename ${conversation.title}`} title="Rename"><Icon name="edit" size={14} /></button>
                <button className="row-action danger" onClick={() => onDelete(conversation.id)} aria-label={`Delete ${conversation.title}`} title="Delete"><Icon name="trash" size={14} /></button>
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="profile">
          <div className="avatar">JD</div>
          <div><strong>Jordan Davis</strong><span>Free workspace</span></div>
          <button className="icon-button" aria-label="Account options"><Icon name="more" size={17} /></button>
        </div>
      </div>
    </aside>
  )
}
