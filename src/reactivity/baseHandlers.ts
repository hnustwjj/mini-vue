import { track, trigger } from './effect'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

// 使用高阶函数来创建get方法
function createGetter(isReadonly = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    // 如果不是readonly就追踪依赖
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}
// 使用高阶函数来创建set方法
function createSetter() {
  return function set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)

    trigger(target, key)
    return res
  }
}

// 可变的，具有响应式逻辑的handler
export const mutableHandlers = {
  set,
  get,
}

// 只读的对象的handler
export const readonlyHandlers = {
  set(target, key) {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    )

    return true
  },
  get: readonlyGet,
}
