let activeEffect
class ReactiveEffect {
  _fn: any
  constructor(fn, public scheduler?: any) {
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
export function effect(fn, options = {} as any) {
  const _effect = new ReactiveEffect(fn, options.scheduler)

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
  // 注意，只有在activeEffect不为空时才添加
  // 并不是所有用到响应式数据的地方都要收集依赖的，只有在effect中才会收集依赖
  if (activeEffect) {
    deps.add(activeEffect)
  }
}
export function trigger(target, key) {
  const deps = getDep(target, key)
  deps.forEach(effect => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}
