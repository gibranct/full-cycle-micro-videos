import { SearchResult } from './../../domain/repository/repository-contracts'

export type PaginationOutputDto<Item = any> = {
  items: Item[]
  total: number
  currentPage: number
  perPage: number
  lastPage: number
}

export class PaginationOutputMapper {
  static toOutput(result: SearchResult): Omit<PaginationOutputDto, 'items'> {
    return {
      total: result.total,
      currentPage: result.currentPage,
      perPage: result.perPage,
      lastPage: result.lastPage,
    }
  }
}
