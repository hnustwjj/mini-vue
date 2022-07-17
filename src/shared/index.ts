export const extend = Object.assign

export function isObject(raw) {
  return raw !== null && typeof raw === 'object'
}

export function hasChanged(newV, old) {
  return Object.is(newV, old)
}
