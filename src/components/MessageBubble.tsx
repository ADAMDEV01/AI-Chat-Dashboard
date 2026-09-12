import type { Message } from '../types'
import { Icon } from './Icon'

export function MessageBubble({ message, onRetry }: { message: Message; onRetry?: () => void }) {
  const isUser = message.role === 'user'
  if (!isUser && !message.content && message.status !== 'error') return null
  return (
    <div className={`message-line ${isUser ? 'user-line' : 'assistant-line'}`}>
      {!isUser && <div className="message-avatar"><Icon name="spark" size={15} /></div>}
      <div className={`message-content ${isUser ? 'user-message' : 'assistant-message'} ${message.status === 'error' ? 'error-message' : ''}`}>
        {!isUser && <span className="message-author">Orbit AI</span>}
        <p>{message.content}</p>
        {message.status === 'error' && onRetry && <button className="retry-button" onClick={onRetry}><Icon name="arrow" size={14} /> Try again</button>}
      </div>
      {isUser && <div className="message-avatar user-avatar">JD</div>}
    </div>
  )
}
