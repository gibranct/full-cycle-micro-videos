import { Category } from '../../../domain/entities/category'
import { CategoryInMemoryRepository } from '../../../infra/repository/category-in-memory.repository'
import { ListCategoriesUseCase } from '../list-categories.use-case'
import { CategoryRepository } from '../../../domain/repository/category.repository'

describe('ListCategoriesUseCase Unit Tests', () => {
  let listCategoriesUseCase: ListCategoriesUseCase
  let categoryRepo: CategoryInMemoryRepository

  beforeEach(() => {
    categoryRepo = new CategoryInMemoryRepository()
    listCategoriesUseCase = new ListCategoriesUseCase(categoryRepo)
  })

  it('should call search with the correct values', async () => {
    const searchSpy = jest.spyOn(categoryRepo, 'search')
    await listCategoriesUseCase.execute({
      page: 1,
      perPage: 10,
      sort: 'name',
      sortDir: 'ASC',
      filter: '',
    })
    expect(searchSpy).toHaveBeenCalledWith(
      new CategoryRepository.SearchParams({
        page: 1,
        perPage: 10,
        sort: 'name',
        sortDir: 'ASC',
        filter: '',
      })
    )
  })

  it('should call toOutput with the correct values', async () => {
    const category = new Category({ name: 'test' })
    jest.spyOn(categoryRepo, 'search').mockResolvedValueOnce(
      new CategoryRepository.SearchResult({
        items: [category],
        total: 1,
        currentPage: 1,
        perPage: 1,
        sort: null,
        sortDir: null,
        filter: null,
      })
    )
    const toOutputSpy = jest.spyOn(
      ListCategoriesUseCase.prototype as any,
      'toOutput'
    )
    await listCategoriesUseCase.execute({})
    expect(toOutputSpy).toHaveBeenCalledWith({
      items: [category],
      total: 1,
      currentPage: 1,
      perPage: 1,
      lastPage: 1,
      sort: null,
      sortDir: null,
      filter: null,
    })
  })

  it('should paginate, filter and sort by createdAt', async () => {
    categoryRepo.items = [
      new Category({ name: 'AA', createdAt: new Date(2020, 1, 1) }),
      new Category({ name: 'AaA', createdAt: new Date(2020, 1, 2) }),
      new Category({ name: 'aAa', createdAt: new Date(2020, 1, 3) }),
      new Category({ name: 'b', createdAt: new Date(2020, 1, 4) }),
    ]
    let result = await listCategoriesUseCase.execute({
      page: 1,
      perPage: 2,
      filter: 'a',
    })
    expect(result.items).toStrictEqual([
      categoryRepo.items[2].toJSON(),
      categoryRepo.items[1].toJSON(),
    ])

    result = await listCategoriesUseCase.execute({
      page: 2,
      perPage: 2,
      filter: 'a',
    })
    expect(result.items).toStrictEqual([categoryRepo.items[0].toJSON()])

    result = await listCategoriesUseCase.execute({
      page: 1,
      perPage: 2,
      filter: 'a',
      sortDir: 'ASC',
      sort: 'createdAt',
    })
    expect(result.items).toStrictEqual([
      categoryRepo.items[0].toJSON(),
      categoryRepo.items[1].toJSON(),
    ])

    result = await listCategoriesUseCase.execute({
      page: 2,
      perPage: 2,
      filter: 'a',
      sortDir: 'ASC',
      sort: 'createdAt',
    })
    expect(result.items).toStrictEqual([categoryRepo.items[2].toJSON()])
  })

  it('should paginate, filter and sort by name', async () => {
    categoryRepo.items = [
      new Category({ name: 'AA', createdAt: new Date(2020, 1, 1) }),
      new Category({ name: 'AaA', createdAt: new Date(2020, 1, 2) }),
      new Category({ name: 'aAa', createdAt: new Date(2020, 1, 3) }),
      new Category({ name: 'b', createdAt: new Date(2020, 1, 4) }),
    ]
    let result = await listCategoriesUseCase.execute({
      page: 1,
      perPage: 2,
      filter: 'a',
      sort: 'name',
      sortDir: 'ASC',
    })
    expect(result.items).toStrictEqual([
      categoryRepo.items[0].toJSON(),
      categoryRepo.items[1].toJSON(),
    ])

    result = await listCategoriesUseCase.execute({
      page: 2,
      perPage: 2,
      filter: 'a',
      sort: 'name',
      sortDir: 'ASC',
    })
    expect(result.items).toStrictEqual([categoryRepo.items[2].toJSON()])

    result = await listCategoriesUseCase.execute({
      page: 1,
      perPage: 2,
      filter: 'a',
      sort: 'name',
      sortDir: 'DESC',
    })
    expect(result.items).toStrictEqual([
      categoryRepo.items[2].toJSON(),
      categoryRepo.items[1].toJSON(),
    ])

    result = await listCategoriesUseCase.execute({
      page: 2,
      perPage: 2,
      filter: 'a',
      sort: 'name',
      sortDir: 'DESC',
    })
    expect(result.items).toStrictEqual([categoryRepo.items[0].toJSON()])
  })
})
