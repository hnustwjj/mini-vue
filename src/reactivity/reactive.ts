import {
  mutableHandlers,
  readonlyHandlers,
  ReactiveFlags,
} from './baseHandlers'

function createActiveObject(raw, handler) {
  return new Proxy(raw, handler)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function isReactive(raw) {
  // 我们只需要去获取响应式对象的某个指定的属性
  // 在handler里判断，如果是获取的这个属性，就返回isReactive的结果
  return !!raw[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(raw) {
  return !!raw[ReactiveFlags.IS_READONLY]
}
