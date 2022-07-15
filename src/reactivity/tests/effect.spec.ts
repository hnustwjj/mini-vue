import { reactive } from '../reactive'
import { effect } from '../effect'
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
})
