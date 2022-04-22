import { Category } from './../../entities/category'
import { CategoryRepository } from '../../repository/category.repository'

export type Input = {
  name: string
  description?: string
  isActive?: boolean
}

export type Output = {
  id: string
  name: string
  description?: string | null
  isActive: boolean
  createdAt: Date
}

export class CreateCategortUseCase {
  constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    const category = new Category(input)

    await this.categoryRepo.insert(category)

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    }
  }
}
