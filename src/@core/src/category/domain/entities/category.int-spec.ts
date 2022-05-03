import { Category } from './category';

describe('Category Integration Tests', () => {
  test('constructor', () => {
    expect(() => new Category({ name: null })).containsErrorMessages({
      name: ['Name must be a string'],
    })

    expect(() => new Category({ name: undefined })).containsErrorMessages({
      name: ['Name is required'],
    })

    expect(() => new Category({ name: 'a'.repeat(256) })).containsErrorMessages({
      name: ['Name must be less than or equal to 255 characters']
    })

    expect(() => new Category({ name: 2 as any, description: 1 as any, isActive: 10 as any, createdAt: 2 as any })).containsErrorMessages({
      name: ['Name must be a string'],
      description: ['Description must be a string'],
      isActive: ['IsActive must be a boolean'],
      createdAt: ['CreatedAt must be a date']
    })

    expect(() => new Category({ name: 'asdasd', createdAt: '2020-02-01' as any })).containsErrorMessages({
      createdAt: ['CreatedAt must be a date']
    })

    expect(() => new Category({ name: 'asdasd', createdAt: new Date(), description: 'description', isActive: true  })).not.toThrow()
  })

  test('update', () => {
    const category = new Category({ name: 'fake_name' })
    expect(() => category.update({ name: null as any, description: null  })).containsErrorMessages({
      name: ['Name must be a string'],
    })

    expect(() => new Category({ name: 'a'.repeat(256), description: 1 as any })).containsErrorMessages({
      name: ['Name must be less than or equal to 255 characters'],
      description: ['Description must be a string'],
    })

    expect(() => new Category({ name: 'a'.repeat(255), description: 'some description' })).not.toThrow()
  })
});