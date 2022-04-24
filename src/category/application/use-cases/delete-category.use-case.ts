import { UseCase } from '../../../@seedwork/application/use-case'
import { CategoryRepository } from '../../domain/repository/category.repository'

export class DeleteCategoryUseCase
  implements UseCase<DeleteCategoryUseCase.Input, DeleteCategoryUseCase.Output>
{
  constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

  async execute(
    input: DeleteCategoryUseCase.Input
  ): Promise<DeleteCategoryUseCase.Output> {
    await this.categoryRepo.delete(input.id)
  }
}

export namespace DeleteCategoryUseCase {
  export type Input = {
    id: string
  }

  export type Output = void
}
