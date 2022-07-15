let activeEffect
class ReactiveEffect {
  _fn: any
  constructor(fn) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    this._fn()
    activeEffect = null
  }
}
export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
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
