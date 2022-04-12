import { Category, CategoryProperties } from './category'


describe('Category Unit Tests', () => {
  test('Category constructor', () => {
    type TestProps = { input: CategoryProperties, expected: any }
    const validateSpy = jest.spyOn(Category, 'validate')
    const createdAt = new Date()
    const testsProps: TestProps[] = [
      { input: { name: 'Movie' }, expected: { name: 'Movie', description: null, isActive: false, createdAt: expect.any(Date) } },
      { input: { name: 'Movie', description: 'A movie category' }, expected: { name: 'Movie', description: 'A movie category', isActive: false, createdAt: expect.any(Date) } },
      { input: { name: 'Movie', description: 'A movie category', isActive: true }, expected: { name: 'Movie', description: 'A movie category', isActive: true, createdAt: expect.any(Date) } },
      { input: { name: 'Movie', description: 'A movie category', isActive: true, createdAt }, expected: { name: 'Movie', description: 'A movie category', isActive: true, createdAt } },
    ]

    testsProps.forEach(({ input, expected }) => {
      const category = new Category(input)
      expect(category).toBeInstanceOf(Category)
      expect(category.props).toEqual(expected)
      expect(validateSpy).toHaveBeenCalled()
    })
  })

  test('getter of name field', () => {
    const sut = new Category({ name: 'Movie' })
    expect(sut.name).toBe('Movie')
  })

  test('getter and setter of description field', () => {
    let sut = new Category({ name: 'Movie' })
    expect(sut.description).toBeNull()

    sut = new Category({ name: 'Movie', description: 'A movie category' })
    expect(sut.description).toBe('A movie category')
  })

  test('getter and setter of isActive field', () => {
    let sut = new Category({ name: 'Movie' })
    expect(sut.isActive).toBe(false)

    sut = new Category({ name: 'Movie', isActive: true })
    expect(sut.isActive).toBe(true)
  })

  test('getter and setter of createdAt field', () => {
    let sut = new Category({ name: 'Movie' })
    expect(sut.createdAt).toBeInstanceOf(Date)

    const createdAt = new Date()
    sut = new Category({ name: 'Movie', isActive: true, createdAt })
    expect(sut.createdAt).toBe(createdAt)
  })

  test('update method', () => {
    const createdAt = new Date()
    const sut = new Category({ name: 'Movie', description: 'A movie category', createdAt })
    expect(sut.name).toBe('Movie')
    expect(sut.description).toBe('A movie category')

    sut.update({ name: 'New Movie', description: 'A new movie category' })
    expect(sut.props).toEqual({ name: 'New Movie', description: 'A new movie category', isActive: false, createdAt })
    expect(sut.name).toBe('New Movie')
    expect(sut.description).toBe('A new movie category')
  })

  test('activate method', () => {
    const sut = new Category({ name: 'Movie', isActive: false })
    expect(sut.isActive).toBe(false)

    sut.activate()
    expect(sut.isActive).toBe(true)
  })

  test('deactivate method', () => {
    const sut = new Category({ name: 'Movie', isActive: true })
    expect(sut.isActive).toBe(true)

    sut.deactivate()
    expect(sut.isActive).toBe(false)
  })
})