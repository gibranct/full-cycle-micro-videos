import * as Yup from 'yup';

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
    this.validate()
  }

  update(props: UpdateProps) {
    this.description = props.description
    this.props.name = props.name
    this.validate()
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

  private validate() {
    const nameErrorMessage = 'Name is required'
    const schema = Yup.object().shape({
      name: Yup.string().typeError(nameErrorMessage).required(nameErrorMessage),
      description: Yup.string().nullable(),
      isActive: Yup.boolean(),
      createdAt: Yup.date(),
      id: Yup.string().required('Id is required')
    })

    schema.validateSync({
      ...this.props,
      id: this.id
    })
  }
}