import {
  SearchParams,
  SearchResult,
} from './../../../@seedwork/domain/repository/repository-contracts'
import { Category } from './../../domain/entities/category'
import { CategoryInMemoryRepository } from './category-in-memory.repository'

describe('CategoryInMemoryRepository Unit Tests', () => {
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository()
  })

  describe('applyFilter', () => {
    it('should return all categories when filter is invalid', async () => {
      const categories = [
        new Category({ name: 'c1' }),
        new Category({ name: 'c2' }),
        new Category({ name: 'c3' }),
      ]

      const filterSpy = jest.spyOn(categories, 'filter' as any)

      let result = await repository['applyFilter'](categories, '')
      expect(result).toStrictEqual(categories)

      result = await repository['applyFilter'](categories, null)
      expect(result).toStrictEqual(categories)

      result = await repository['applyFilter'](categories, undefined)
      expect(result).toStrictEqual(categories)

      expect(filterSpy).toHaveBeenCalledTimes(0)
    })

    it('should return categories that match the filter', async () => {
      const categories = [
        new Category({ name: 'c1' }),
        new Category({ name: 'c2' }),
        new Category({ name: 'c3' }),
      ]

      const filterSpy = jest.spyOn(categories, 'filter' as any)

      const result1 = await repository['applyFilter'](categories, 'c1')
      expect(result1).toStrictEqual([categories[0]])

      const result2 = await repository['applyFilter'](categories, 'c2')
      expect(result2).toStrictEqual([categories[1]])

      const result3 = await repository['applyFilter'](categories, 'c3')
      expect(result3).toStrictEqual([categories[2]])

      expect(filterSpy).toHaveBeenCalledTimes(3)
    })
  })

  describe('applySort', () => {
    it('should return categories sorted by the sort field', async () => {
      const categories = [
        new Category({
          name: 'c3',
          createdAt: new Date('2022-01-03T00:00:00.000'),
        }),
        new Category({
          name: 'c1',
          createdAt: new Date('2022-01-01T00:00:00.000'),
        }),
        new Category({
          name: 'c2',
          createdAt: new Date('2022-01-02T00:00:00.000'),
        }),
      ]

      let result = await repository['applySort'](categories, 'name', 'ASC')
      expect(result).toStrictEqual([
        categories[1],
        categories[2],
        categories[0],
      ])

      result = await repository['applySort'](categories, 'name', 'DESC')
      expect(result).toStrictEqual([
        categories[0],
        categories[2],
        categories[1],
      ])

      result = await repository['applySort'](categories, 'createdAt', 'DESC')
      expect(result).toStrictEqual([
        categories[0],
        categories[2],
        categories[1],
      ])

      result = await repository['applySort'](categories, 'createdAt', 'ASC')
      expect(result).toStrictEqual([
        categories[1],
        categories[2],
        categories[0],
      ])
    })

    it('should return categories sorted by the property createAt by default', async () => {
      const categories = [
        new Category({
          name: 'c3',
          createdAt: new Date('2022-01-03T00:00:00.000'),
        }),
        new Category({
          name: 'c1',
          createdAt: new Date('2022-01-01T00:00:00.000'),
        }),
        new Category({
          name: 'c2',
          createdAt: new Date('2022-01-02T00:00:00.000'),
        }),
      ]

      const result = await repository['applySort'](categories, null, null)
      expect(result).toStrictEqual([
        categories[0],
        categories[2],
        categories[1],
      ])
    })
  })

  describe('applyPaginate', () => {
    it('should return all categories when paginate is invalid', async () => {
      const categories = [
        new Category({ name: 'c1' }),
        new Category({ name: 'c2' }),
        new Category({ name: 'c3' }),
      ]

      const sliceSpy = jest.spyOn(categories, 'slice' as any)

      let result = await repository['applyPaginate'](categories, null, null)
      expect(result).toStrictEqual(categories)

      result = await repository['applyPaginate'](
        categories,
        undefined,
        undefined
      )
      expect(result).toStrictEqual(categories)

      expect(sliceSpy).not.toHaveBeenCalled()
    })

    it('should return categories paginated', async () => {
      const categories = [
        new Category({ name: 'c1' }),
        new Category({ name: 'c2' }),
        new Category({ name: 'c3' }),
      ]

      const sliceSpy = jest.spyOn(categories, 'slice' as any)

      let result = await repository['applyPaginate'](categories, 1, 1)
      expect(result).toStrictEqual([categories[0]])

      result = await repository['applyPaginate'](categories, 2, 1)
      expect(result).toStrictEqual([categories[1]])

      result = await repository['applyPaginate'](categories, 3, 1)
      expect(result).toStrictEqual([categories[2]])

      result = await repository['applyPaginate'](categories, 4, 1)
      expect(result).toStrictEqual([])

      expect(sliceSpy).toHaveBeenCalledTimes(4)
    })
  })

  describe('search', () => {
    it('should apply paginate only other params are null', async () => {
      const createdAt = new Date('2022-01-01T00:00:00.000')
      const categories = Array(16).fill(new Category({ name: 'c1', createdAt }))
      repository.items = [...categories]
      const result = await repository.search(new SearchParams())
      expect(result).toStrictEqual(
        new SearchResult({
          items: categories.slice(0, 15),
          total: 16,
          currentPage: 1,
          perPage: 15,
          sort: null,
          sortDir: null,
          filter: null,
        })
      )
    })

    it('should apply paginate and filter', async () => {
      const createdAt = new Date('2022-01-01T00:00:00.000')
      const categories = [
        new Category({ name: 'test', createdAt }),
        new Category({ name: 'a', createdAt }),
        new Category({ name: 'TesT', createdAt }),
        new Category({ name: 'TEST', createdAt }),
      ]
      repository.items = categories
      let result = await repository.search(
        new SearchParams({
          filter: 'TEST',
          page: 1,
          perPage: 2,
        })
      )
      expect(result).toStrictEqual(
        new SearchResult({
          items: [categories[0], categories[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TEST',
        })
      )

      result = await repository.search(
        new SearchParams({ filter: 'TEST', page: 2, perPage: 2 })
      )
      expect(result).toStrictEqual(
        new SearchResult({
          items: [categories[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: 'TEST',
        })
      )
    })

    it('should apply paginate and sort', async () => {
      const createdAt = new Date('2022-01-01T00:00:00.000')
      const categories = [
        new Category({ name: 'e', createdAt }),
        new Category({ name: 'a', createdAt }),
        new Category({ name: 'b', createdAt }),
        new Category({ name: 'c', createdAt }),
        new Category({ name: 'd', createdAt }),
      ]
      repository.items = categories

      const arrange = [
        {
          params: new SearchParams({
            sort: 'name',
            page: 1,
            perPage: 2,
          }),
          result: new SearchResult({
            items: [categories[1], categories[2]],
            total: 5,
            currentPage: 1,
            perPage: 2,
            sort: 'name',
            sortDir: 'ASC',
            filter: null,
          }),
        },
        {
          params: new SearchParams({
            sort: 'name',
            page: 2,
            perPage: 2,
          }),
          result: new SearchResult({
            items: [categories[3], categories[4]],
            total: 5,
            currentPage: 2,
            perPage: 2,
            sort: 'name',
            sortDir: 'ASC',
            filter: null,
          }),
        },
        {
          params: new SearchParams({
            sort: 'name',
            page: 1,
            perPage: 2,
            sortDir: 'DESC',
          }),
          result: new SearchResult({
            items: [categories[0], categories[4]],
            total: 5,
            currentPage: 1,
            perPage: 2,
            sort: 'name',
            sortDir: 'DESC',
            filter: null,
          }),
        },
        {
          params: new SearchParams({
            sort: 'name',
            page: 2,
            perPage: 2,
            sortDir: 'DESC',
          }),
          result: new SearchResult({
            items: [categories[3], categories[2]],
            total: 5,
            currentPage: 2,
            perPage: 2,
            sort: 'name',
            sortDir: 'DESC',
            filter: null,
          }),
        },
      ]
      for (const { params, result } of arrange) {
        const output = await repository.search(params)
        expect(output).toStrictEqual(result)
      }
    })

    it('should search using filter, sort and paginate', async () => {
      const createdAt = new Date('2022-01-01T00:00:00.000')
      const categories = [
        new Category({
          name: 'test',
          createdAt: new Date('2022-01-03T00:00:00.000'),
        }),
        new Category({ name: 'a', createdAt }),
        new Category({
          name: 'TEST',
          createdAt: new Date('2022-01-01T00:00:00.000'),
        }),
        new Category({ name: 'e', createdAt }),
        new Category({
          name: 'TeSt',
          createdAt: new Date('2022-01-02T00:00:00.000'),
        }),
      ]
      repository.items = categories

      const arrange = [
        {
          params: new SearchParams({
            sort: 'name',
            page: 1,
            perPage: 2,
            filter: 'TEST',
          }),
          result: new SearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            currentPage: 1,
            perPage: 2,
            sort: 'name',
            sortDir: 'ASC',
            filter: 'TEST',
          }),
        },
        {
          params: new SearchParams({
            sort: 'name',
            page: 2,
            perPage: 2,
            filter: 'TEST',
          }),
          result: new SearchResult({
            items: [categories[0]],
            total: 3,
            currentPage: 2,
            perPage: 2,
            sort: 'name',
            sortDir: 'ASC',
            filter: 'TEST',
          }),
        },
        {
          params: new SearchParams({
            sort: 'createdAt',
            page: 1,
            perPage: 2,
            filter: 'TEST',
            sortDir: 'DESC',
          }),
          result: new SearchResult({
            items: [categories[0], categories[4]],
            total: 3,
            currentPage: 1,
            perPage: 2,
            sort: 'createdAt',
            sortDir: 'DESC',
            filter: 'TEST',
          }),
        },
        {
          params: new SearchParams({
            sort: 'createdAt',
            page: 2,
            perPage: 2,
            filter: 'TEST',
            sortDir: 'DESC',
          }),
          result: new SearchResult({
            items: [categories[2]],
            total: 3,
            currentPage: 2,
            perPage: 2,
            sort: 'createdAt',
            sortDir: 'DESC',
            filter: 'TEST',
          }),
        },
      ]
      for (const { params, result } of arrange) {
        const output = await repository.search(params)
        expect(output).toStrictEqual(result)
      }
    })
  })
})
