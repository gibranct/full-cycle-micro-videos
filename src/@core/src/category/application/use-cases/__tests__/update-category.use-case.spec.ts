import { Category } from '../../../domain/entities/category'
import { CategoryInMemoryRepository } from '../../../infra/repository/category-in-memory.repository'
import { UpdateCategoryUseCase } from '../update-category.use-case'

describe('UpdateCategoryUseCase Unit Tests', () => {
  let createCategoryUseCase: UpdateCategoryUseCase
  let categoryRepository: CategoryInMemoryRepository

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository()
    createCategoryUseCase = new UpdateCategoryUseCase(categoryRepository)
  })

  it('should call findById with the correct value', async () => {
    const category = new Category({ name: 'test' })
    categoryRepository.items.push(category)
    const findByIdSpy = jest.spyOn(categoryRepository, 'findById')
    await createCategoryUseCase.execute({
      id: category.id,
      name: category.name,
    })
    expect(findByIdSpy).toHaveBeenCalledTimes(1)
    expect(findByIdSpy).toHaveBeenCalledWith(category.id)
  })

  it('should throw error when category not found', async () => {
    const category = new Category({ name: 'test' })
    const promise = createCategoryUseCase.execute({
      id: category.id,
      name: category.name,
    })
    expect(promise).rejects.toThrowError('Entity not found')
  })

  it('should call category.update with the correct values', async () => {
    const category = new Category({ name: 'test', description: 'desc' })
    categoryRepository.items.push(category)
    const updateSpy = jest.spyOn(category, 'update')
    await createCategoryUseCase.execute({
      id: category.id,
      name: 'test2',
      description: 'desc2',
    })
    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).toHaveBeenCalledWith({
      name: 'test2',
      description: 'desc2',
    })

    expect(category.name).toBe('test2')
    expect(category.description).toBe('desc2')
  })

  it('should activate category', async () => {
    const category = new Category({ name: 'test', description: 'desc' })
    const activateSpy = jest.spyOn(category, 'activate')
    categoryRepository.items.push(category)
    expect(category.isActive).toBe(false)
    await createCategoryUseCase.execute({
      id: category.id,
      name: 'test2',
      description: 'desc2',
      isActive: true,
    })
    expect(category.isActive).toBe(true)
    expect(activateSpy).toHaveBeenCalledTimes(1)
  })

  it('should deactivate category', async () => {
    const category = new Category({
      name: 'test',
      description: 'desc',
      isActive: true,
    })
    const deactivateSpy = jest.spyOn(category, 'deactivate')
    categoryRepository.items.push(category)
    expect(category.isActive).toBe(true)
    await createCategoryUseCase.execute({
      id: category.id,
      name: 'test2',
      description: 'desc2',
      isActive: false,
    })
    expect(category.isActive).toBe(false)
    expect(deactivateSpy).toHaveBeenCalledTimes(1)
  })

  it('should call repository.update with the correct values', async () => {
    const category = new Category({ name: 'test', description: 'desc' })
    categoryRepository.items.push(category)
    const updateSpy = jest.spyOn(categoryRepository, 'update')
    await createCategoryUseCase.execute({
      id: category.id,
      name: 'test2',
      description: 'desc2',
      isActive: true,
    })
    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).toHaveBeenCalledWith(
      new Category(
        {
          name: 'test2',
          description: 'desc2',
          isActive: true,
          createdAt: category.createdAt,
        },
        category.uniqueEntityId
      )
    )
  })

  it('should update the category', async () => {
    const category = new Category({ name: 'test', description: 'desc' })
    categoryRepository.items.push(category)
    await createCategoryUseCase.execute({
      id: category.id,
      name: 'test2',
      description: 'desc2',
      isActive: true,
    })
    expect(category.toJSON()).toStrictEqual({
      id: category.id,
      name: 'test2',
      description: 'desc2',
      isActive: true,
      createdAt: category.createdAt,
    })
  })
})
