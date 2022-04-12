import { EntityValidationError } from '../../../@seedwork/domain/errors/validation-error';
import CategoryValidatorFactory from '../validators/category-validator';
import { Entity } from './../../../@seedwork/domain/entity/entity';
import { UniqueEntityId } from './../../../@seedwork/domain/value-objects/unique-entity-id.vo';

export type CategoryProperties = {
  name: string
  description?: string
  isActive?: boolean
  createdAt?: Date
}

type UpdateProps = {
  name: string
  description: string
}

export class Category extends Entity<CategoryProperties> {

  constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
    super(props, id)
    this.description = props.description
    this.isActive = props.isActive
    this.createdAt = props.createdAt
    Category.validate(props)
  }

  update(props: UpdateProps) {
    this.description = props.description
    this.props.name = props.name
    Category.validate(props)
  }

  activate() {
    this.isActive = true
  }

  deactivate() {
    this.isActive = false
  }

  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  private set description(value: string) {
    this.props.description = value ?? null
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  private set isActive(value: boolean) {
    this.props.isActive = value || false
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  private set createdAt(value: Date) {
    this.props.createdAt = value ?? new Date()
  }

  static validate(props: CategoryProperties) {
    const validator = CategoryValidatorFactory.create()
    const isValid = validator.validate(props)
    if (!isValid) {
      throw new EntityValidationError(validator.errors)
    }
  }
}