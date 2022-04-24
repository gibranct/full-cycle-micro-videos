import { UniqueEntityId } from '../../../../@seedwork/domain/value-objects/unique-entity-id.vo'
import { Category } from '../../../domain/entities/category'
import { CategoryInMemoryRepository } from '../../../infra/repository/category-in-memory.repository'
import { CreateCategoryUseCase } from '../create-category.use-case'

describe('CreateCategoryUseCase Unit Tests', () => {
  let createCategoryUseCase: CreateCategoryUseCase
  let categoryRepository: CategoryInMemoryRepository

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository()
    createCategoryUseCase = new CreateCategoryUseCase(categoryRepository)
  })

  it('should call CategoryRepository with the correct values', async () => {
    const insertSpy = jest.spyOn(categoryRepository, 'insert')
    const output = await createCategoryUseCase.execute({
      name: 'test',
      description: 'test',
      isActive: true,
    })
    expect(insertSpy).toHaveBeenCalledTimes(1)
    expect(insertSpy).toHaveBeenCalledWith(
      new Category(
        {
          createdAt: output.createdAt,
          name: 'test',
          description: 'test',
          isActive: true,
        },
        new UniqueEntityId(output.id)
      )
    )
  })

  it('should insert category', async () => {
    const output = await createCategoryUseCase.execute({
      name: 'test',
      description: 'test',
      isActive: true,
    })
    const category = await categoryRepository.findById(output.id)
    expect(category).toBeDefined()
    expect(output).toStrictEqual({
      id: category.id.toString(),
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    })
  })
})
