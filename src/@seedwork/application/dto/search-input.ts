import { SortDirection } from './../../domain/repository/repository-contracts'

export type SearchInputDto<Filter = string> = {
  page?: number | null
  perPage?: number | null
  sort?: string | null
  sortDir?: SortDirection | null
  filter?: Filter | null
}
