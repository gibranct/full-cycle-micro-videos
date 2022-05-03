import { PaginationOutputMapper } from './pagination-output'
import { SearchResult } from '../../domain/repository/repository-contracts'

describe('PaginationOutputMapper Unit Tests', () => {
  test('toOutput', () => {
    const result: SearchResult = new SearchResult({
      items: [],
      total: 10,
      currentPage: 1,
      perPage: 10,
      sort: null,
      sortDir: null,
      filter: null,
    })
    const output = PaginationOutputMapper.toOutput(result)

    expect(output).toStrictEqual({
      total: 10,
      currentPage: 1,
      perPage: 10,
      lastPage: 1,
    })
  })
})
