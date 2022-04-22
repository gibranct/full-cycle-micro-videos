import { InMemoryRepository } from './in-memory.repository'
import { Entity } from '../entity/entity'

type EntityProps = {
  name: string
  price: number
}

class EntityStub extends Entity<EntityProps> {
  constructor(name: string, price: number) {
    super({
      name,
      price,
    })
  }
}

class InMemoryRepositoryStub extends InMemoryRepository<EntityStub> {}

describe('InMemoryRepository Unit Tests', () => {
  let inMemoryRepository: InMemoryRepositoryStub

  beforeEach(() => {
    inMemoryRepository = new InMemoryRepositoryStub()
  })

  it('should insert a new entity', async () => {
    const entity = new EntityStub('name', 1)
    await inMemoryRepository.insert(entity)
    expect(inMemoryRepository.items.length).toBe(1)
    expect(inMemoryRepository.items[0].toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should update an entity', async () => {
    const entity = new EntityStub('name', 1)
    await inMemoryRepository.insert(entity)
    expect(inMemoryRepository.items[0].toJSON()).toStrictEqual(entity.toJSON())
    entity.props.name = 'new name'
    await inMemoryRepository.update(entity)
    expect(inMemoryRepository.items[0].toJSON()).toStrictEqual({
      ...entity.toJSON(),
      name: 'new name',
    })
  })

  it('should throw if entity to be updated is not found', async () => {
    const entity = new EntityStub('name', 1)
    expect(inMemoryRepository.update(entity)).rejects.toThrow(
      'Entity not found'
    )
  })

  it('should delete the entity', async () => {
    const entity1 = new EntityStub('name1', 1)
    const entity2 = new EntityStub('name2', 2)
    await inMemoryRepository.insert(entity1)
    await inMemoryRepository.insert(entity2)
    expect(inMemoryRepository.items.length).toBe(2)
    await inMemoryRepository.delete(entity1.id)
    expect(inMemoryRepository.items.length).toBe(1)
    expect(inMemoryRepository.items[0].toJSON()).toStrictEqual(entity2.toJSON())
  })

  it('should throw when try to delete entity if entity is not found', async () => {
    const entity1 = new EntityStub('name1', 1)
    const entity2 = new EntityStub('name2', 2)
    await inMemoryRepository.insert(entity1)
    await inMemoryRepository.insert(entity2)
    expect(inMemoryRepository.items.length).toBe(2)
    expect(inMemoryRepository.delete('fake-id')).rejects.toThrow(
      'Entity not found'
    )
  })

  it('should find entity by id', async () => {
    const entity = new EntityStub('name', 1)
    await inMemoryRepository.insert(entity)
    const foundEntity = await inMemoryRepository.findById(entity.id)
    expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should throw if entity is not found', async () => {
    const entity = new EntityStub('name', 1)
    expect(inMemoryRepository.findById(entity.id)).rejects.toThrow(
      'Entity not found'
    )
  })

  it('should find all', async () => {
    const entity1 = new EntityStub('name1', 1)
    const entity2 = new EntityStub('name2', 2)
    await inMemoryRepository.insert(entity1)
    await inMemoryRepository.insert(entity2)
    const foundEntities = await inMemoryRepository.findAll()
    expect(inMemoryRepository.items.length).toBe(foundEntities.length)
    expect(foundEntities).toStrictEqual([entity1, entity2])
  })
})
