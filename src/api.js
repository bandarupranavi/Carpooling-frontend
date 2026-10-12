// Update these paths to match your Spring Boot controller mappings.
export const API_BASE_URL = 'http://localhost:8081'
export const API_ENDPOINTS = { students: '/api/students', rides: '/api/rides', bookings: '/api/bookings' }

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const text = await response.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!response.ok) throw new Error(data?.message || `Request failed: ${response.status}`)
  return data
}
