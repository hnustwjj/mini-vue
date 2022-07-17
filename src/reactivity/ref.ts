import { hasChanged, isObject } from '../shared'
import { trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'
class RefImpl {
  private _value // 用RefImpl来保存value
  public dep = new Set() // 因为ref只对应一个dep（value），所以在ref内部管理自己的依赖即可
  private _rawValue  // 保留没转化之前的值
  constructor(value) {
    this._rawValue = value
    // 如果value是对象，如果是就转化成reactive
    this._value = convert(value)
  }

  get value() {
    trackEffects(this.dep)
    // 收集依赖
    return this._value
  }

  set value(newValue) {
    // 如果没有发生改变，就返回
    if (hasChanged(newValue, this._rawValue)) return
    this._rawValue = newValue  // 更新旧值
    // 触发依赖
    this._value = convert(newValue)
    triggerEffects(this.dep)
  }
}
export function ref(raw) {
  return new RefImpl(raw)
}

function convert(value){
  return isObject(value) ? reactive(value) : value 
}