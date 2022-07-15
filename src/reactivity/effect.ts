let activeEffect
class ReactiveEffect {
  _fn: any
  constructor(fn) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    const res = this._fn()
    activeEffect = null
    // 返回fn的返回值
    return res
  }
}
export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
  // 因为run方法内部是用this指针来修改全局的activeEffect
  // 所以这里需要修改this指向
  return _effect.run.bind(_effect)
}

const targetMap = new WeakMap()
function getDep(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let deps = depsMap.get(key)
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }
  return deps
}
export function track(target, key) {
  const deps = getDep(target, key)
  deps.add(activeEffect)
}
export function trigger(target, key) {
  const deps = getDep(target, key)
  deps.forEach(effect => effect.run())

}
