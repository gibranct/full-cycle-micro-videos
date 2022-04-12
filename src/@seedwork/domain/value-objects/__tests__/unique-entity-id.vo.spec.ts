import { validate as uuidValidate } from 'uuid';

import { InvalidUuidError } from '../../errors/invalid-uuid.error';
import { UniqueEntityId } from '../unique-entity-id.vo';

describe('UniqueEntityId Unit Tests', () => {
  it('should create a valid id if no id is passed', () => {
    const sut = new UniqueEntityId()
    expect(sut.value).toBeDefined()
    expect(uuidValidate(sut.value)).toBeTruthy()
  })

  it('should throw if invalid id is passed', () => {
    expect(() => new UniqueEntityId('invalid-id'))
    .toThrowError(new InvalidUuidError())
  })

  it('should create a valid id if a valid id is passed', () => {
    const validId = 'd738812a-6191-4e58-915d-3d883f9b21b4'
    const sut = new UniqueEntityId(validId)
    expect(sut.value).toBe(validId)
    expect(sut.value).toBeDefined()
    expect(uuidValidate(sut.value)).toBeTruthy()
  })
})