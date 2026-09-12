export function EmptyState({ children = 'Start a conversation' }: { children?: React.ReactNode }) {
  return <div className="empty-state">{children}</div>
}
