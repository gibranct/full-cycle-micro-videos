import CategoryValidatorFactory from './category-validator';

let validator: any = null;

describe('CategoryValidator Unit Tests', () => {

  beforeEach(() => validator = CategoryValidatorFactory.create())

  it('should validate with errors', () => {
    const params = [
      { input: { name: undefined } as any, expected: { name: ['Name is required'] } },
      { input: { name: null }, expected: { name: ['Name must be a string'] } },
      { input: { name: '' }, expected: { name: ['Name is required'] } },
      { input: { name: 'n'.repeat(256) }, expected: { name: ['Name must be less than or equal to 255 characters'] } },
      { input: { name: 'name', isActive: 'dasdsad' }, expected: { isActive: ['IsActive must be a boolean'] } },
      { input: { name: 'name', isActive: 0 }, expected: { isActive: ['IsActive must be a boolean'] } },
      { input: { name: '', isActive: 1 }, expected: { isActive: ['IsActive must be a boolean'], name: ['Name is required'] } },
      { input: { name: 'name', createdAt: 'dasdsad' }, expected: { createdAt: ['CreatedAt must be a date'] } },
      { input: { name: 'name', createdAt: '33/33/2025' }, expected: { createdAt: ['CreatedAt must be a date'] } },
      { input: { name: 'name', createdAt: '2025-33-05' }, expected: { createdAt: ['CreatedAt must be a date'] } },
      { input: { name: 'name', createdAt: '2025-12-05' }, expected: { createdAt: ['CreatedAt must be a date'] } },
    ]
    params.forEach(({ input, expected }) => {
      expect({ validator, data: input }).containsErrorMessages(expected);
    })
  })

  it('should validate with no errors', () => {
    const params = [
      { input: { name: 'fake_name' } },
      { input: { name: 'fake_name', description: 'fake_description' } },
      { input: { name: 'fake_name', description: 'fake_description', isActive: true } },
      { input: { name: 'fake_name', description: 'fake_description', isActive: true, createdAt: new Date()  } },
    ]
    params.forEach(({ input }) => {
      expect({ validator, data: input }).not.containsErrorMessages(input);
    })
  })
});
