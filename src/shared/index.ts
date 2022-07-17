export const extend = Object.assign

export function isObject(raw) {
  return raw !== null && typeof raw === 'object'
}
