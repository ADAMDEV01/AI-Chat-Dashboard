import type { ReactNode } from 'react'

export function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onClick={onClose}><section className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>{children}</section></div>
}
