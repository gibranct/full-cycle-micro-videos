import { ValueObject } from '../value-object';


class ValueObjectStub extends ValueObject {}


describe('ValueObject Unit Tests', () => {
  it ('should set a value', () => {
    let sut = new ValueObjectStub('fake_id')
    expect(sut.value).toBe('fake_id')

    sut = new ValueObjectStub({ prop: 'any_value' })
    expect(sut.value).toStrictEqual({ prop: 'any_value' })
  })

  it('should convert to a string', () => {
    type ArrangeProps = { input: any, outputExpected: string }
    const date = new Date()
    const arrange: ArrangeProps[]  = [
      { input: null, outputExpected: 'null' },
      { input: undefined, outputExpected: 'undefined' },
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
});