import { useEffect, useRef } from 'react'
import type { Conversation, Message } from '../types'
import { Icon } from './Icon'
import { MessageBubble } from './MessageBubble'

interface ChatWindowProps {
  conversation: Conversation
  draft: string
  sending: boolean
  onDraftChange: (value: string) => void
  onSend: (content?: string) => void
  onStop: () => void
  onRetry: (message: Message) => void
}

export function ChatWindow({ conversation, draft, sending, onDraftChange, onSend, onStop, onRetry }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages.length, conversation.messages[conversation.messages.length - 1]?.content])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`
  }, [draft])

  return (
    <main className="chat-main">
      <header className="chat-header">
        <div>
          <div className="eyebrow"><span className="online-dot" /> Personal workspace</div>
          <h1>{conversation.title}</h1>
        </div>
        <button className="header-more icon-button" aria-label="Conversation options"><Icon name="more" /></button>
      </header>

      <section className="messages-area" aria-live="polite" aria-label="Chat messages">
        <div className="messages-inner">
          {conversation.messages.length === 0 && (
            <div className="welcome-card">
              <div className="welcome-icon"><Icon name="spark" size={21} /></div>
              <h2>What can I help you with?</h2>
              <p>Ask a question, brainstorm an idea, or get help turning a thought into a plan.</p>
              <div className="suggestion-grid">
                {['Help me plan my week', 'Explain a complex idea', 'Brainstorm something new'].map((suggestion) => <button key={suggestion} onClick={() => onSend(suggestion)}>{suggestion}<Icon name="arrow" size={14} /></button>)}
              </div>
            </div>
          )}
          {conversation.messages.map((message) => <MessageBubble key={message.id} message={message} onRetry={message.status === 'error' ? () => onRetry(message) : undefined} />)}
          {sending && conversation.messages[conversation.messages.length - 1]?.role === 'assistant' && (
            <div className="message-line assistant-line">
              <div className="message-avatar"><Icon name="spark" size={15} /></div>
              <div className="typing-indicator" aria-label="Orbit AI is thinking"><i /><i /><i /></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </section>

      <div className="composer-wrap">
        <form className="composer" onSubmit={(event) => { event.preventDefault(); onSend() }}>
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); onSend() } }}
            placeholder="Message Orbit AI..."
            rows={1}
            disabled={sending}
            aria-label="Message Orbit AI"
          />
          <div className="composer-footer">
            <span className="composer-hint">Shift + Enter for a new line</span>
            {sending ? (
              <button type="button" className="send-button stop-button" onClick={onStop} aria-label="Stop generating"><Icon name="stop" size={16} /></button>
            ) : (
              <button type="submit" className="send-button" disabled={!draft.trim()} aria-label="Send message"><Icon name="send" size={16} /></button>
            )}
          </div>
        </form>
        <p className="disclaimer">Orbit AI can make mistakes. Check important information.</p>
      </div>
    </main>
  )
}
