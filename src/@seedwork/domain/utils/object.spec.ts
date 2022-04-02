import { deepFreeze } from './object'

describe('Object Unit Tests', () => {
  it('should not freeze a scalar value', () => {
    const str = deepFreeze(5)
    expect(typeof str).toBe('number')

    const n = deepFreeze('string')
    expect(typeof n).toBe('string')

    const booleanTrue = deepFreeze(true)
    expect(typeof booleanTrue).toBe('boolean')

    const booleanFalse = deepFreeze(false)
    expect(typeof booleanFalse).toBe('boolean')
  })

  it ('should freeze an object', () => {
    const obj = deepFreeze({
      prop1: 'value1',
      deep: { prop2: 'value2', prop3: 'value3' },
    })
    expect(() => {
      (obj as any).prop1 = 'new_value'
    }).toThrowError('Cannot assign to read only property \'prop1\' of object \'#<Object>\'')

    expect(() => {
      (obj as any).deep.prop2 = 'new_value'
    }).toThrowError('Cannot assign to read only property \'prop2\' of object \'#<Object>\'')
  })
})