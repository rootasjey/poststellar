export async function copyImageToClipboard(src?: string): Promise<boolean> {
  if (!src) return false

  // Helper: convert a data: URL into a Blob
  const dataUrlToBlob = (dataUrl: string): Blob => {
    const parts = dataUrl.split(',')
    const header = parts[0]
    const b64 = parts[1]
    if (!header || !b64) throw new Error('invalid data url')
    const mimePart = header.split(':')[1]
    if (!mimePart) throw new Error('invalid data url header')
    const mime = mimePart.split(';')[0]
    const bytes = atob(b64 as string)
    const array = new Uint8Array(bytes.length)
    for (let i = 0; i < bytes.length; i++) array[i] = bytes.charCodeAt(i)
    return new Blob([array], { type: mime })
  }

  // Try to fetch and copy the binary to clipboard
  try {
    const blob: Blob = await (async () => {
      try {
        const res = await fetch(src)
        if (!res.ok) throw new Error('fetch failed')
        return await res.blob()
      } catch {
        if (String(src).startsWith('data:')) return dataUrlToBlob(String(src))
        throw new Error('cannot obtain blob')
      }
    })()

    if (navigator.clipboard && (navigator.clipboard as any).write) {
      // @ts-ignore ClipboardItem may not be present in all TS lib definitions
      const item = new ClipboardItem({ [blob.type || 'image/png']: blob })
      await (navigator.clipboard as any).write([item])
      return true
    }
  } catch {
    // ignored — we'll fall back to copying the url as text below
  }

  // Fallback: copy the URL/text representation
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(String(src))
      return true
    }
  } catch {}

  return false
}
