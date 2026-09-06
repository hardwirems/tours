/**
 * SHA-256 hash — used to hash client IPs before storing them in Supabase.
 * (We don't store raw IPs; we store a hash so we can deduplicate without
 * retaining PII. In production, use a salt that you rotate periodically.)
 */

export function sha256Hex(input: string): string {
  const bytes = new TextEncoder().encode(input)
  const hash = crypto.subtle.digest('SHA-256', bytes) as Promise<ArrayBuffer>
  return hash.then((buf) => {
    const hex = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    return hex
  }) as unknown as string
}

/**
 * Hash an IP with a salt. In production, use a per-day or per-week salt
 * so you can still deduplicate within a window but can't reverse the hash.
 */
export function hashIp(ip: string, salt: string): string {
  return sha256Hex(`${salt}:${ip}`)
}

/**
 * Generate a session id from request headers.
 * In production, use a proper session cookie with a secure random id.
 */
export function generateSessionId(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}
