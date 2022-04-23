import { UseCase } from './../../../../@seedwork/application/use-case'
import { CategoryOutput, CategoryOutputMapper } from './../dto/category-output'
import { CategoryRepository } from '../../repository/category.repository'

export class GetCategoryUseCase
  implements UseCase<GetCategoryUseCase.Input, GetCategoryUseCase.Output>
{
  constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

  async execute(
    input: GetCategoryUseCase.Input
  ): Promise<GetCategoryUseCase.Output> {
    const category = await this.categoryRepo.findById(input.id)
    return CategoryOutputMapper.toOutput(category)
  }
}

export namespace GetCategoryUseCase {
  export type Input = {
    id: string
  }

  export type Output = CategoryOutput
}
