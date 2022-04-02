import { ValueObject } from '../value-object';


class ValueObjectStub extends ValueObject {}


describe('ValueObject Unit Tests', () => {
  it ('should set a value', () => {
    let sut = new ValueObjectStub('fake_id')
    expect(sut.value).toBe('fake_id')

    sut = new ValueObjectStub({ prop: 'any_value' })
    expect(sut.value).toStrictEqual({ prop: 'any_value' })
  })

  it ('should throw an error when value is null or undefined', () => {
    expect(() => new ValueObjectStub(null)).toThrowError('Value cannot be null or undefined')
    expect(() => new ValueObjectStub(undefined)).toThrowError('Value cannot be null or undefined')
  })

  it('should convert to a string', () => {
    type ArrangeProps = { input: any, outputExpected: string }
    const date = new Date()
    const arrange: ArrangeProps[]  = [
      { input: '', outputExpected: '' },
      { input: 'fake', outputExpected: 'fake' },
      { input: 5, outputExpected: '5' },
      { input: 0, outputExpected: '0' },
      { input: true, outputExpected: 'true' },
      { input: false, outputExpected: 'false' },
      { input: date, outputExpected: date.toString() },
      { input: { prop: 'value' }, outputExpected: JSON.stringify({ prop: 'value' }) },
    ]

    arrange.forEach(({ input, outputExpected }) => {
      const sut = new ValueObjectStub(input)
      expect(sut + '').toBe(outputExpected)
    })
  })

  it('should create an immutable object', () => {
    const sut = new ValueObjectStub('fake_id')
    expect(() => {
      (sut as any)['value'] = 'new_value'
    }).toThrowError('Cannot set property value of [object Object] which has only a getter')

    const obj = new ValueObjectStub({
      prop1: 'value1',
      deep: { prop2: 'value2', prop3: new Date() },
    })
    expect(() => {
      (obj as any).value.prop1 = 'new_value'
    }).toThrowError('Cannot assign to read only property \'prop1\' of object \'#<Object>\'')

    expect(() => {
      (obj as any).value.deep.prop3 = 'new_value'
    }).toThrowError('Cannot assign to read only property \'prop3\' of object \'#<Object>\'')

    expect(obj.value.deep.prop3).toBeInstanceOf(Date)
    expect(typeof obj.value.deep.prop2).toBe('string')
    expect(typeof obj.value.prop1).toBe('string')
  })
});