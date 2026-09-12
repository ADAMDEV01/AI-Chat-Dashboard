import type { SVGProps } from 'react'

type IconName = 'arrow' | 'check' | 'chevron' | 'close' | 'edit' | 'menu' | 'moon' | 'more' | 'plus' | 'search' | 'send' | 'spark' | 'sun' | 'trash' | 'stop'

export function Icon({ name, size = 18, ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  const paths: Record<IconName, JSX.Element> = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    edit: <path d="m12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    send: <path d="m22 2-7 20-4-9-9-4Z M22 2 11 13" />,
    spark: <path d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4ZM19 16l-.6 2.4L16 19l2.4.6L19 22l.6-2.4L22 19l-2.4-.6Z" />,
    stop: <><rect x="6" y="6" width="12" height="12" rx="2" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    trash: <><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></>,
  }

  return <svg aria-hidden="true" focusable="false" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>{paths[name]}</svg>
}
