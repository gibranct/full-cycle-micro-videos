import { Category } from './../../../entities/category'
import { CategoryInMemoryRepository } from './../../../../infra/repository/category-in-memory.repository'
import { DeleteCategoryUseCase } from './../delete-category.use-case'

describe('DeleteCategoryUseCase Unit Tests', () => {
  let deleteCategoryUseCase: DeleteCategoryUseCase
  let categoryRepository: CategoryInMemoryRepository

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository()
    deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository)
  })

  it('should throw when category not found', () => {
    const promise = deleteCategoryUseCase.execute({
      id: 'fake_id',
    })
    expect(promise).rejects.toThrowError('Entity not found')
  })

  it('should delete category', async () => {
    const deleteSpy = jest.spyOn(categoryRepository, 'delete')
    const category = new Category({ name: 'fake-name' })
    await categoryRepository.insert(category)

    await deleteCategoryUseCase.execute({
      id: category.id,
    })

    expect(deleteSpy).toHaveBeenCalledWith(category.id)
    expect(categoryRepository.items.length).toBe(0)
  })
})
