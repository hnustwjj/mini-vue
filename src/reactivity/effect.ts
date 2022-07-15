import { extend } from './../shared/index'
let activeEffect
const targetMap = new WeakMap()

class ReactiveEffect {
  private _fn: any
  deps = [] // 保存收集了当前effect的dep
  active = true // 标记是否要清除副作用
  onStop?: () => void // stop的回调
  constructor(fn, public scheduler?: any) {
    this._fn = fn
  }

  run() {
    activeEffect = this // 修改全局的标记，以便于track收集依赖
    const res = this._fn() // 默认会执行传入的fn
    activeEffect = null // 重置
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

// 获取target对象的key的dep
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

// 追踪依赖（收集）
export function track(target, key) {
  const dep = getDep(target, key)
  // 注意，只有在activeEffect不为空时才添加
  // 并不是所有用到响应式数据的地方都要收集依赖的，只有在effect中才会收集依赖
  if (activeEffect) {
    // 双向存储依赖
    // 一方面dep保存effect用于触发依赖
    // 另一方面effect保存dep用于从dep中删除依赖
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

// 触发依赖
export function trigger(target, key) {
  const dep = getDep(target, key)
  dep.forEach(effect => {
    if (effect.scheduler) {
      // 用户可以自定义依赖触发的逻辑，没有自定义的话就默认执行run
      effect.scheduler()
    } else {
      effect.run()
    }
  })
}

// 入口
export function effect(fn, options = {} as any) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run() // 默认执行一次传入的函数
  // 合并对象里的方法
  extend(_effect, options)

  // 因为run方法内部是用this指针来修改全局的activeEffect
  // 所以这里需要修改this指向
  const runner: any = _effect.run.bind(_effect)
  
  // 将effect挂载以便于在stop时获取effect
  runner.effect = _effect
  return runner
}

// 取消某个runner对应effect的响应式
export function stop(runner) {
  runner.effect.stop()
}
