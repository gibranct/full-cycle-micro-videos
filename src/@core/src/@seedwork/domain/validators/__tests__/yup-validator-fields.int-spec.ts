import * as Yup from 'yup'

import { YupValidatorFields } from '../yup-validator-fields';

const schema = Yup.object().shape({
  name: Yup.string().typeError('Name is required').required('Name is required').max(50, 'Name must be less than 50 characters'),
  price: Yup.number().typeError('Price is required').required('Price is required').min(0, 'Price cannot be less than 0'),
})

class YupValidatorFieldsStub extends YupValidatorFields<{ name: string, price: number }> {
  constructor() {
    super(schema);
  }
}

describe('YupValidatorFields Integration Tests', () => {
  it('should validate that name and price is required', () => {
    const sut = new YupValidatorFieldsStub();
    sut.validate(null)
    expect(sut.errors).toStrictEqual({ name: ['Name is required'], price: ['Price is required'] })
  });

  it('should validate that name is less than 50 characters', () => {
    const sut = new YupValidatorFieldsStub();
    sut.validate({ name: 'o'.repeat(51), price: 1.0 })
    expect(sut.errors).toStrictEqual({ name: ['Name must be less than 50 characters'] })
  })

  it('should validate that price cannot be less than 0', () => {
    const sut = new YupValidatorFieldsStub();
    sut.validate({ name: 'o'.repeat(50), price: -1 })
    expect(sut.errors).toStrictEqual({ price: ['Price cannot be less than 0'] })

    sut.validate({ name: 'o'.repeat(50), price: 0 })
    expect(sut.errors).toBeNull()
  })

  it('should be valid', () => {
    const sut = new YupValidatorFieldsStub();
    sut.validate({ name: 'o'.repeat(50), price: 0 })
    expect(sut.errors).toBeNull()
    expect(sut.validatedData).toStrictEqual({ name: 'o'.repeat(50), price: 0 })
  })
});