import type { Conversation } from '../types'

const message = (id: string, role: 'user' | 'assistant', content: string, createdAt: number) => ({
  id,
  role,
  content,
  createdAt,
  status: 'complete' as const,
})

export const initialConversations: Conversation[] = [
  {
    id: 'conversation-product-launch',
    title: 'Planning a product launch',
    createdAt: Date.now() - 1000 * 60 * 18,
    updatedAt: Date.now() - 1000 * 60 * 14,
    messages: [
      message('launch-1', 'user', 'Help me create a simple launch plan for a new productivity app.', Date.now() - 1000 * 60 * 18),
      message('launch-2', 'assistant', 'Absolutely. Start with a crisp audience promise, then plan a small beta, a feedback loop, and a focused launch moment. I can help turn each phase into a checklist.', Date.now() - 1000 * 60 * 17),
    ],
  },
  {
    id: 'conversation-morning-routine',
    title: 'A better morning routine',
    createdAt: Date.now() - 1000 * 60 * 60 * 3 - 1000 * 60,
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
    messages: [
      message('routine-1', 'user', 'What are a few gentle ways to make my mornings less rushed?', Date.now() - 1000 * 60 * 60 * 3 - 1000 * 60),
      message('routine-2', 'assistant', 'Try preparing one thing the night before, leaving a ten-minute buffer, and choosing one anchor habit such as water, light movement, or a quiet breakfast.', Date.now() - 1000 * 60 * 60 * 3),
    ],
  },
  {
    id: 'conversation-weekend-trip',
    title: 'Weekend trip ideas',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    messages: [
      message('trip-1', 'user', 'Can you help me think through a relaxed weekend trip?', Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 2),
      message('trip-2', 'assistant', 'Choose one memorable area rather than too many stops. A relaxed rhythm is one planned highlight, one local meal, and plenty of unstructured time each day.', Date.now() - 1000 * 60 * 60 * 24),
    ],
  },
]
