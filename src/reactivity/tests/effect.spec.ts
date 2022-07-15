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
})
