import { track, trigger } from './effect'
import { reactive, readonly } from './reactive'
import { isObject } from '../shared/index'
// 避免重复创建
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
export const enum ReactiveFlags {
  // 用于状态判断的枚举
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}
// 使用高阶函数来创建get方法
function createGetter(isReadonly = false) {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key, receiver)

    // 判断res的类型是不是对象类型，如果是就转化为响应式对象或者readonly对象
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

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
