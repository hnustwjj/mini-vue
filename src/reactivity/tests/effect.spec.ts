import { reactive } from '../reactive'
import { stop, effect } from '../effect'
describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10,
    })
    let newAge
    effect(() => {
      newAge = user.age + 1
    })
    expect(newAge).toBe(11)

    // update
    user.age = 20
    expect(newAge).toBe(21)
  })

  it('return runner when call effect', () => {
    let foo = 10
    // 调用effect会返回一个runner
    const runner = effect(() => ++foo)
    expect(foo).toBe(11)
    // 调用runner会返回传入的函数的执行结果
    const res = runner()
    expect(res).toBe(12)
    expect(foo).toBe(12)
  })

  it('scheduler', () => {
    let dummy
    let run: any
    // 1.通过effect的第二个参数给定的scheduler的fn
    // 2.effect第一次执行的时候还是会默认执行fn
    // 3.当响应式对象set时，不会执行fn了，而是执行scheduler
    // 4.如果说当执行runner的时候，会再次执行fn

    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })

    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    // 一开始scheduler不会被调用
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    obj.foo++
    // 会在trigger时第一次调用scheduler
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dumy
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dumy = obj.foo
    })
    // 执行set，触发依赖
    obj.foo = 2
    expect(dumy).toBe(2)
    stop(runner)
    // obj.foo = 3
    obj.foo++
    expect(dumy).toBe(2)

    // stopped effect should still be manually callable
    runner()
    expect(dumy).toBe(3)
  })

  it('onStop', () => {
    const obj = reactive({
      foo: 1,
    })
    const onStop = jest.fn()
    let dummy
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {
        onStop,
      }
    )
    stop(runner)
    expect(onStop).toHaveBeenCalledTimes(1)
  })
})
