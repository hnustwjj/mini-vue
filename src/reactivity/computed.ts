import { ReactiveEffect } from './effect'

class ComputedRef {
  private _getter
  private _dirty = true // 标记响应式数据是否发生改变
  private _effect // 保存依赖对象
  private _value // 缓存值
  constructor(getter) {
    this._getter = getter
    this._effect = new ReactiveEffect(getter, () => {
      this._dirty = true //传入scheduler，标记响应式数据已经发生改变
    })
  }

  get value() {
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run() // 执行时会收集依赖
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRef(getter)
}
