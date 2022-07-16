import { reactive, isReactive } from '../reactive'
describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const obj = reactive(original)
    expect(obj).not.toBe(original)
    expect(obj.foo).toBe(1)

    expect(isReactive(obj)).toBe(true)
    expect(isReactive(original)).toBe(false)
  })
})
