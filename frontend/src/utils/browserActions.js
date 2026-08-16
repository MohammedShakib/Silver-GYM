export function buildDirectionsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export function openDirections(address) {
  if (typeof window === 'undefined') {
    return
  }

  window.open(buildDirectionsUrl(address), '_blank', 'noopener,noreferrer')
}

export async function sharePage({ title, text, url }) {
  if (typeof window === 'undefined') {
    return false
  }

  const payload = { title, text, url }

  if (navigator.share) {
    try {
      await navigator.share(payload)
      return true
    } catch {
      return false
    }
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url)
      return true
    } catch {
      return false
    }
  }

  return false
}
