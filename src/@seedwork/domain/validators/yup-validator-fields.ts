import { ObjectSchema } from 'yup'

import { FieldErrors, ValidatorFieldsInterface } from './validator-fields-interface';

export abstract class YupValidatorFields<T = any> implements ValidatorFieldsInterface<T> {
  errors: FieldErrors = null
  validatedData: any = null

  constructor(private readonly schema: ObjectSchema<any>) {}

  validate(data: any): boolean {
    try {
      this.schema.validateSync(data, { abortEarly: false })
      this.validatedData = data
      return true
    } catch (error: any) {
      this.errors = {}
      for (const erroInfo of error.inner) {
        this.errors[erroInfo.path] = erroInfo.errors
      }
      return false
    }
  }
}