import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from './../../../../@seedwork/application/dto/pagination-output'
import { SearchInputDto } from './../../../../@seedwork/application/dto/search-input'
import { UseCase } from './../../../../@seedwork/application/use-case'
import { CategoryOutput, CategoryOutputMapper } from './../dto/category-output'
import { CategoryRepository } from '../../repository/category.repository'

export class ListCategoriesUseCase
  implements UseCase<ListCategoriesUseCase.Input, ListCategoriesUseCase.Output>
{
  constructor(private readonly categoryRepo: CategoryRepository.Repository) {}

  async execute(
    input: ListCategoriesUseCase.Input
  ): Promise<ListCategoriesUseCase.Output> {
    const searchParasm = new CategoryRepository.SearchParams(input)
    const result = await this.categoryRepo.search(searchParasm)
    return this.toOutput(result)
  }

  private toOutput(
    searchResult: CategoryRepository.SearchResult
  ): ListCategoriesUseCase.Output {
    return {
      items: searchResult.items.map((category) =>
        CategoryOutputMapper.toOutput(category)
      ),
      ...PaginationOutputMapper.toOutput(searchResult),
    }
  }
}

export namespace ListCategoriesUseCase {
  export type Input = SearchInputDto

  export type Output = PaginationOutputDto<CategoryOutput>
}
