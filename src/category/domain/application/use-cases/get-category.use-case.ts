import { UseCase } from './../../../../@seedwork/application/use-case'
import { CategoryOutput } from './../dto/category-output.dto'
import { CategoryRepository } from '../../repository/category.repository'

export class GetCategoryUseCase
  implements UseCase<GetCategoryUseCase.Input, GetCategoryUseCase.Output>
{
  constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

  async execute(
    input: GetCategoryUseCase.Input
  ): Promise<GetCategoryUseCase.Output> {
    const category = await this.categoryRepo.findById(input.id)

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    }
  }
}

export namespace GetCategoryUseCase {
  export type Input = {
    id: string
  }

  export type Output = CategoryOutput
}
