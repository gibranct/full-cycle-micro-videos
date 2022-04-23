import { UseCase } from './../../../../@seedwork/application/use-case'
import { CategoryOutput, CategoryOutputMapper } from './../dto/category-output'
import { CategoryRepository } from '../../repository/category.repository'

export class UpdateCategoryUseCase
  implements UseCase<UpdateCategoryUseCase.Input, UpdateCategoryUseCase.Output>
{
  constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

  async execute(
    input: UpdateCategoryUseCase.Input
  ): Promise<UpdateCategoryUseCase.Output> {
    const category = await this.categoryRepo.findById(input.id)
    category.update({
      name: input.name,
      description: input.description,
    })

    if (input.isActive === true) {
      category.activate()
    } else if (input.isActive === false) {
      category.deactivate()
    }

    await this.categoryRepo.update(category)

    return CategoryOutputMapper.toOutput(category)
  }
}

export namespace UpdateCategoryUseCase {
  export type Input = {
    id: string
    name: string
    description?: string
    isActive?: boolean
  }

  export type Output = CategoryOutput
}
