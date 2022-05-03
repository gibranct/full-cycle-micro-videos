import { validate as uuidValidate } from 'uuid'

import { Entity } from './entity'
import { UniqueEntityId } from '../value-objects/unique-entity-id.vo'

class EntityStub extends Entity<{ prop1: string }> {
  constructor(prop1: string, id?: UniqueEntityId) {
    super({ prop1 }, id)
  }
}

describe('Entity Unity Tests', () => {
  test('Entity constructor', () => {
    let sut = new EntityStub('value1')
    expect(sut).toBeTruthy()
    expect(sut).toBeInstanceOf(Entity)
    expect(sut.props.prop1).toBe('value1')
    expect(sut.id).toBeTruthy()
    expect(sut.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(uuidValidate(sut.id)).toBe(true)

    const uniqueId = new UniqueEntityId()
    sut = new EntityStub('value1', uniqueId)
    expect(sut.id).toBe(uniqueId.value)
    expect(sut.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(sut.toJSON()).toStrictEqual({
      prop1: 'value1',
      id: uniqueId.value,
    })
  })
})
