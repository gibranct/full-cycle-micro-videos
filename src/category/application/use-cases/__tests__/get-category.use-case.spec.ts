import { Category } from '../../../domain/entities/category'
import { CategoryInMemoryRepository } from '../../../infra/repository/category-in-memory.repository'
import { GetCategoryUseCase } from '../get-category.use-case'

describe('GetCategoryUseCase Unit Tests', () => {
  let getCategoryUseCase: GetCategoryUseCase
  let categoryRepository: CategoryInMemoryRepository

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository()
    getCategoryUseCase = new GetCategoryUseCase(categoryRepository)
  })

  it('should throw when category not found', () => {
    const promise = getCategoryUseCase.execute({
      id: 'fake_id',
    })
    expect(promise).rejects.toThrowError('Entity not found')
  })

  it('should return category', async () => {
    const findByIdSpy = jest.spyOn(categoryRepository, 'findById')
    const category = new Category({ name: 'fake-name' })
    await categoryRepository.insert(category)

    const foundCategory = await getCategoryUseCase.execute({ id: category.id })

    expect(findByIdSpy).toHaveBeenCalledWith(category.id)
    expect(foundCategory).toStrictEqual({
      id: category.id.toString(),
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    })
  })
})
