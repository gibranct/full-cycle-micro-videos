import { Entity } from '../../entity/entity'
import { SearchParams, SearchResult } from '../repository-contracts'

class EntityStub extends Entity<{ name: string; price: number }> {
  constructor(name: string, price: number) {
    super({
      name,
      price,
    })
  }
}

describe('RepositoryContracts Unit Tests', () => {
  describe('SearchParams', () => {
    test('constructor', () => {
      const arrange = [
        {
          input: {},
          expected: {
            page: 1,
            perPage: 15,
            sort: null,
            sortDir: null,
            filter: null,
          } as any,
        },
        {
          input: {
            sort: null,
            sortDir: null,
            filter: null,
          } as any,
          expected: {
            page: 1,
            perPage: 15,
            sort: null,
            sortDir: null,
            filter: null,
          } as any,
        },
        {
          input: {
            sort: '',
            sortDir: '',
            filter: '',
          } as any,
          expected: {
            page: 1,
            perPage: 15,
            sort: null,
            sortDir: null,
            filter: null,
          } as any,
        },
        {
          input: {
            page: 2,
            perPage: 20,
            sort: 'name',
            sortDir: 'DESC',
            filter: 'test',
          },
          expected: {
            page: 2,
            perPage: 20,
            sort: 'name',
            sortDir: 'DESC',
            filter: 'test',
          } as any,
        },
        {
          input: {
            page: '2',
            perPage: '20',
            sort: 'name',
            sortDir: 'ASC',
            filter: 'test',
          },
          expected: {
            page: 2,
            perPage: 20,
            sort: 'name',
            sortDir: 'ASC',
            filter: 'test',
          } as any,
        },
      ]

      arrange.forEach(({ input, expected }) => {
        const sut = new SearchParams(input)
        expect({
          page: sut.page,
          perPage: sut.perPage,
          sort: sut.sort,
          sortDir: sut.sortDir,
          filter: sut.filter,
        }).toStrictEqual(expected)
      })
    })
  })

  describe('SearchResult', () => {
    test('constructor', () => {
      const arrange = [
        {
          input: {
            items: [],
            total: 0,
            currentPage: 0,
            perPage: 1,
            sort: null,
            sortDir: null,
            filter: null,
          } as any,
          expected: {
            items: [],
            total: 0,
            perPage: 1,
            lastPage: 0,
            currentPage: 0,
            sort: null,
            sortDir: null,
            filter: null,
          } as any,
        },
        {
          input: {
            items: [{ name: 'test', price: 1 }],
            total: 10,
            currentPage: 1,
            perPage: 5,
            sort: null,
            sortDir: null,
            filter: null,
          } as any,
          expected: {
            items: [{ name: 'test', price: 1 }],
            total: 10,
            perPage: 5,
            lastPage: 2,
            currentPage: 1,
            sort: null,
            sortDir: null,
            filter: null,
          } as any,
        },
        {
          input: {
            items: [{ name: 'test', price: 1 }],
            total: 101,
            currentPage: 1,
            perPage: 20,
            sort: 'name',
            sortDir: 'ASC',
            filter: 'test',
          } as any,
          expected: {
            items: [{ name: 'test', price: 1 }],
            total: 101,
            perPage: 20,
            lastPage: 6,
            currentPage: 1,
            sort: 'name',
            sortDir: 'ASC',
            filter: 'test',
          } as any,
        },
      ]

      arrange.forEach(({ input, expected }) => {
        const sut = new SearchResult<EntityStub>(input)
        expect(sut.toJSON()).toStrictEqual(expected)
      })
    })
  })
})
