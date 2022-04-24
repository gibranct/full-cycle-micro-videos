import { Category } from '../../domain/entities/category'

export type CategoryOutput = {
  id: string
  name: string
  description?: string | null
  isActive: boolean
  createdAt: Date
}

export class CategoryOutputMapper {
  static toOutput(category: Category): CategoryOutput {
    return category.toJSON()
  }
}
