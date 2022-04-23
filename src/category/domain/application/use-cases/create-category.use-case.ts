import { UseCase } from './../../../../@seedwork/application/use-case'
import { CategoryOutput } from './../dto/category-output.dto'
import { Category } from './../../entities/category'
import { CategoryRepository } from '../../repository/category.repository'

export class CreateCategoryUseCase
  implements UseCase<CreateCategoryUseCase.Input, CreateCategoryUseCase.Output>
{
  constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

  async execute(
    input: CreateCategoryUseCase.Input
  ): Promise<CreateCategoryUseCase.Output> {
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

export namespace CreateCategoryUseCase {
  export type Input = {
    name: string
    description?: string
    isActive?: boolean
  }

  export type Output = CategoryOutput
}
