import { CategoryOutputMapper } from './category-output'
import { Category } from './../../entities/category'

describe('CategoryOutputMapper Unit Tests', () => {
  test('toOutput', () => {
    const createdAt = new Date()
    const category = new Category({
      name: 'test',
      description: 'test',
      isActive: true,
      createdAt,
    })

    const output = CategoryOutputMapper.toOutput(category)

    expect(output).toStrictEqual({
      id: category.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt,
    })
  })
})
