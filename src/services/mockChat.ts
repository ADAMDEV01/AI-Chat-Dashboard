const responseLibrary = [
  'That is a thoughtful question. A good way to approach it is to start with the smallest useful version, then iterate from real feedback.',
  'Here is a practical framework: define the outcome, list the constraints, choose one measurable next step, and review what you learn before expanding the scope.',
  'I can help with that. Break the work into a clear goal, a short checklist, and a quick feedback loop so progress stays visible.',
]

export class MockChatError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MockChatError'
  }
}

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms)
    const cancel = () => {
      window.clearTimeout(timer)
      reject(new DOMException('The response was stopped.', 'AbortError'))
    }
    if (signal.aborted) cancel()
    signal.addEventListener('abort', cancel, { once: true })
  })
}

export async function streamMockResponse(
  prompt: string,
  signal: AbortSignal,
  onChunk: (chunk: string) => void,
) {
  await wait(650, signal)
  if (/\b(error|fail|broken|crash)\b/i.test(prompt)) {
    throw new MockChatError('The local model could not complete that request. Please retry.')
  }

  const base = responseLibrary[prompt.length % responseLibrary.length]
  const response = `${base} ${prompt.length > 80 ? 'If you want, I can turn this into a more detailed plan.' : 'What would you like to explore next?'}`
  const words = response.split(' ')
  let result = ''
  for (const [index, word] of words.entries()) {
    await wait(28, signal)
    result += `${index === 0 ? '' : ' '}${word}`
    onChunk(`${index === 0 ? '' : ' '}${word}`)
  }
  return result
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}
