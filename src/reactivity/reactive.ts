import { mutableHandlers, readonlyHandlers } from './baseHandlers'

function createActiveObject(raw, handler) {
  return new Proxy(raw, handler)
}
export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}
export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}
