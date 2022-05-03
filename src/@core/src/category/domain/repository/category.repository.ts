import {
  SearchableRepositoryInterface,
  SearchParams as DefaulSearchParams,
  SearchResult as DefaultSearchResult,
} from './../../../@seedwork/domain/repository/repository-contracts'
import { Category } from './../entities/category'

export namespace CategoryRepository {
  export type Filter = string

  export class SearchParams extends DefaulSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<Category, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      Category,
      Filter,
      SearchParams,
      SearchResult
    > {}
}
