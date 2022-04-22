import { SearchParams, SearchResult } from './../repository-contracts'
import { InMemorySearchableRepository } from '../in-memory.repository'
import { Entity } from '../../entity/entity'

type EntityProps = {
  name: string
  price: number
}

class EntityStub extends Entity<EntityProps> {
  constructor(name: string, price: number) {
    super({
      name,
      price,
    })
  }
}

class InMemorySearchableRepositoryStub extends InMemorySearchableRepository<EntityStub> {
  sortableFields: string[] = ['name']

  protected async applyFilter(
    items: EntityStub[],
    filter: string
  ): Promise<EntityStub[]> {
    if (!filter) {
      return items
    }

    return items.filter(
      (x) =>
        x.props.name.toLowerCase().includes(filter.toLowerCase()) ||
        x.props.price.toString().includes(filter.toLowerCase())
    )
  }
}

describe('InMemorySearchableRepository Unit Tests', () => {
  describe('applyFilter', () => {
    it('should return all items when filter is invalid', async () => {
      const repository = new InMemorySearchableRepositoryStub()
      const items = [
        new EntityStub('item1', 1),
        new EntityStub('item2', 2),
        new EntityStub('item3', 3),
      ]

      const filterSpy = jest.spyOn(items, 'filter' as any)

      let result = await repository['applyFilter'](items, '')
      expect(result).toStrictEqual(items)

      result = await repository['applyFilter'](items, null)
      expect(result).toStrictEqual(items)

      result = await repository['applyFilter'](items, undefined)
      expect(result).toStrictEqual(items)

      expect(filterSpy).toHaveBeenCalledTimes(0)
    })

    it('should return items that match the filter', async () => {
      const repository = new InMemorySearchableRepositoryStub()
      const items = [
        new EntityStub('item1', 1),
        new EntityStub('item2', 2),
        new EntityStub('item3', 3),
      ]

      const filterSpy = jest.spyOn(items, 'filter' as any)

      const result1 = await repository['applyFilter'](items, 'item1')
      expect(result1).toStrictEqual([items[0]])

      const result2 = await repository['applyFilter'](items, 'item2')
      expect(result2).toStrictEqual([items[1]])

      const result3 = await repository['applyFilter'](items, 'item3')
      expect(result3).toStrictEqual([items[2]])

      expect(filterSpy).toHaveBeenCalledTimes(3)
    })
  })

  describe('applySort', () => {
    it('should return all items when sort is invalid', async () => {
      const repository = new InMemorySearchableRepositoryStub()
      const items = [
        new EntityStub('item1', 1),
        new EntityStub('item2', 2),
        new EntityStub('item3', 3),
      ]

      const sortSpy = jest.spyOn(items, 'sort' as any)

      let result = await repository['applySort'](items, '', '' as any)
      expect(result).toStrictEqual(items)

      result = await repository['applySort'](items, null, null)
      expect(result).toStrictEqual(items)

      result = await repository['applySort'](items, undefined, undefined)
      expect(result).toStrictEqual(items)

      result = await repository['applySort'](items, 'price', 'ASC')
      expect(result).toStrictEqual(items)

      result = await repository['applySort'](items, 'name', '' as any)
      expect(result).toStrictEqual(items)

      expect(sortSpy).not.toHaveBeenCalled()
    })

    it('should return items sorted by the sort field', async () => {
      const repository = new InMemorySearchableRepositoryStub()
      const items = [
        new EntityStub('item3', 1),
        new EntityStub('item1', 2),
        new EntityStub('item2', 3),
      ]

      const result1 = await repository['applySort'](items, 'name', 'ASC')
      expect(result1).toStrictEqual([items[1], items[2], items[0]])

      const result2 = await repository['applySort'](items, 'name', 'DESC')
      expect(result2).toStrictEqual([items[0], items[2], items[1]])
    })
  })

  describe('applyPaginate', () => {
    it('should return all items when paginate is invalid', async () => {
      const repository = new InMemorySearchableRepositoryStub()
      const items = [
        new EntityStub('item1', 1),
        new EntityStub('item2', 2),
        new EntityStub('item3', 3),
      ]

      const sliceSpy = jest.spyOn(items, 'slice' as any)

      let result = await repository['applyPaginate'](items, null, null)
      expect(result).toStrictEqual(items)

      result = await repository['applyPaginate'](items, undefined, undefined)
      expect(result).toStrictEqual(items)

      expect(sliceSpy).not.toHaveBeenCalled()
    })

    it('should return items paginated', async () => {
      const repository = new InMemorySearchableRepositoryStub()
      const items = [
        new EntityStub('item1', 1),
        new EntityStub('item2', 2),
        new EntityStub('item3', 3),
      ]

      const sliceSpy = jest.spyOn(items, 'slice' as any)

      let result = await repository['applyPaginate'](items, 1, 1)
      expect(result).toStrictEqual([items[0]])

      result = await repository['applyPaginate'](items, 2, 1)
      expect(result).toStrictEqual([items[1]])

      result = await repository['applyPaginate'](items, 3, 1)
      expect(result).toStrictEqual([items[2]])

      result = await repository['applyPaginate'](items, 4, 1)
      expect(result).toStrictEqual([])

      expect(sliceSpy).toHaveBeenCalledTimes(4)
    })
  })

  describe('search', () => {
    it('should apply paginate only other params are null', async () => {
      const repository = new InMemorySearchableRepositoryStub()
      const items = Array(16).fill(new EntityStub('item1', 1))
      repository.items = [...items]
      const result = await repository.search(new SearchParams())
      expect(result).toStrictEqual(
        new SearchResult({
          items: items.slice(0, 15),
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
      const repository = new InMemorySearchableRepositoryStub()
      const items = [
        new EntityStub('test', 1),
        new EntityStub('a', 2),
        new EntityStub('TesT', 2),
        new EntityStub('TEST', 3),
      ]
      repository.items = items
      let result = await repository.search(
        new SearchParams({ filter: 'TEST', page: 1, perPage: 2 })
      )
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
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
          items: [items[3]],
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
      const repository = new InMemorySearchableRepositoryStub()
      const items = [
        new EntityStub('e', 1),
        new EntityStub('a', 1),
        new EntityStub('b', 1),
        new EntityStub('c', 1),
        new EntityStub('d', 1),
      ]
      repository.items = items

      const arrange = [
        {
          params: new SearchParams({
            sort: 'name',
            page: 1,
            perPage: 2,
          }),
          result: new SearchResult({
            items: [items[1], items[2]],
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
            items: [items[3], items[4]],
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
            items: [items[0], items[4]],
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
            items: [items[3], items[2]],
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
      const repository = new InMemorySearchableRepositoryStub()
      const items = [
        new EntityStub('test', 1),
        new EntityStub('a', 1),
        new EntityStub('TEST', 1),
        new EntityStub('e', 1),
        new EntityStub('TeSt', 1),
      ]
      repository.items = items

      const arrange = [
        {
          params: new SearchParams({
            sort: 'name',
            page: 1,
            perPage: 2,
            filter: 'TEST',
          }),
          result: new SearchResult({
            items: [items[2], items[4]],
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
            items: [items[0]],
            total: 3,
            currentPage: 2,
            perPage: 2,
            sort: 'name',
            sortDir: 'ASC',
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
