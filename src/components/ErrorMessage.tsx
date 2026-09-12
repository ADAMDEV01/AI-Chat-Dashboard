export function ErrorMessage({ children = 'Something went wrong. Please try again.' }: { children?: React.ReactNode }) {
  return <p role="alert" className="error-message">{children}</p>
}
