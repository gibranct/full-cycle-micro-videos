import { UseCase } from '../../../@seedwork/application/use-case'
import { CategoryOutput, CategoryOutputMapper } from '../dto/category-output'
import { Category } from '../../domain/entities/category'
import { CategoryRepository } from '../../domain/repository/category.repository'

export class CreateCategoryUseCase
  implements UseCase<CreateCategoryUseCase.Input, CreateCategoryUseCase.Output>
{
  constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

  async execute(
    input: CreateCategoryUseCase.Input
  ): Promise<CreateCategoryUseCase.Output> {
    const category = new Category(input)
    await this.categoryRepo.insert(category)

    return CategoryOutputMapper.toOutput(category)
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
