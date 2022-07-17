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

  it('nested reactive', () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })
})
