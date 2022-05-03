import * as Yup from 'yup'

import { YupValidatorFields } from '../yup-validator-fields';

const schema = Yup.object().shape({})

class YupValidatorFieldsStub extends YupValidatorFields<{ field: string }> {
  constructor() {
    super(schema);
  }
}

class ErrorStub extends Error {
  public inner: any[] = [];
  constructor() {
    super('');
  }
}

describe('YupValidatorFields Unit Tests', () => {
  it('should initialize errors and validatedData variables with null', () => {
    const sut = new YupValidatorFieldsStub();
    expect(sut.errors).toBeNull();
    expect(sut.validatedData).toBeNull();
  });

  it('should validate with errros', () => {
    const validateSyncSpy = jest.spyOn(schema, 'validateSync')
    const errorStub = new ErrorStub();
    errorStub.inner = [{ path: 'field', errors: ['field is required'] }]
    validateSyncSpy.mockImplementationOnce(() => { throw errorStub })
    const sut = new YupValidatorFieldsStub()
    const isValid = sut.validate({ field: '' })

    expect(isValid).toBe(false)
    expect(validateSyncSpy).toHaveBeenCalledTimes(1)
    expect(sut.errors).toStrictEqual({ field: ['field is required'] })
    expect(sut.validatedData).toBeNull()
  })

  it('should validate without errros', () => {
    const validateSyncSpy = jest.spyOn(schema, 'validateSync')
    validateSyncSpy.mockImplementationOnce(() => ({} as any))
    const sut = new YupValidatorFieldsStub()
    const isValid = sut.validate({ field: '' })

    expect(isValid).toBe(true)
    expect(validateSyncSpy).toHaveBeenCalledTimes(1)
    expect(sut.errors).toBeNull()
    expect(sut.validatedData).toStrictEqual({ field: '' })
  })
});