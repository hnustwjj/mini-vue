import { extend } from './../shared/index'
let activeEffect
const targetMap = new WeakMap()

class ReactiveEffect {
  private _fn: any
  deps = [] //保存收集了当前effect的dep
  active = true //标记是否要清除副作用
  onStop?: () => void //stop的回调
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

  stop() {
    // 只有在active为true的时候才清除
    if (this.active) {
      this.active = false
      cleanupEffect(this)
      this.onStop?.()
    }
  }
}
function cleanupEffect(effect) {
  // 从deps的所有dep中移除当前依赖
  effect.deps.forEach((dep: Set<any>) => {
    dep.delete(effect)
  })
}

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
  const dep = getDep(target, key)
  // 注意，只有在activeEffect不为空时才添加
  // 并不是所有用到响应式数据的地方都要收集依赖的，只有在effect中才会收集依赖
  if (activeEffect) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

export function trigger(target, key) {
  const dep = getDep(target, key)
  dep.forEach(effect => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}

export function effect(fn, options = {} as any) {
  const _effect = new ReactiveEffect(fn, options.scheduler)

  _effect.run()
  // 合并对象里的方法
  extend(_effect, options)
  // 因为run方法内部是用this指针来修改全局的activeEffect
  // 所以这里需要修改this指向
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function stop(runner) {
  runner.effect.stop()
}
