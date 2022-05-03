import * as Yup from 'yup';

import { YupValidatorFields } from '../../../@seedwork/domain/validators/yup-validator-fields';
import { CategoryProperties } from './../entities/category';

const categorySchema = Yup.object().shape({
  name: Yup.string().strict(true)
    .typeError('Name must be a string')
    .required('Name is required')
    .max(255, 'Name must be less than or equal to 255 characters'),
  description: Yup.string()
    .strict(true)
    .typeError('Description must be a string')
    .nullable(),
  isActive: Yup.boolean().strict(true).typeError('IsActive must be a boolean'),
  createdAt: Yup.date().strict(true)
  .typeError('CreatedAt must be a date')
})

export class CategoryValidator extends YupValidatorFields<CategoryProperties> {
  constructor() {
    super(categorySchema);
  }

  validate(data: CategoryProperties): boolean {
    return super.validate(data);
  }
}

export default class CategoryValidatorFactory {
  static create(): CategoryValidator {
    return new CategoryValidator();
  }
}