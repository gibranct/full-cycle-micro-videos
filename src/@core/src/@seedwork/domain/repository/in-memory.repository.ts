import { NotFoundError } from '../errors/not-found.error'
import {
  RepositoryInterface,
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
} from './repository-contracts'
import { Entity } from '../entity/entity'
import { UniqueEntityId } from '../value-objects/unique-entity-id.vo'

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = []

  async insert(entity: E): Promise<void> {
    this.items.push(entity)
  }

  async update(entity: E): Promise<void> {
    const _id = entity.id
    await this._get(_id)
    const indexFound = this.items.findIndex((x) => x.id === _id)
    this.items[indexFound] = entity
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const _id = `${id}`
    await this._get(`${id}`)
    this.items = this.items.filter((x) => x.id !== _id)
  }

  findById(id: string | UniqueEntityId): Promise<E> {
    return this._get(`${id}`)
  }

  async findAll(): Promise<E[]> {
    return [...this.items]
  }

  protected async _get(id: string): Promise<E> {
    const item = this.items.find((x) => x.id === id)
    if (!item) throw new NotFoundError('Entity not found')
    return item
  }
}

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E>
{
  sortableFields: string[] = []
  async search(props: SearchParams): Promise<SearchResult<E>> {
    const filteredItems = await this.applyFilter(this.items, props.filter)
    const sortedItems = await this.applySort(
      filteredItems,
      props.sort,
      props.sortDir
    )
    const paginatedItems = await this.applyPaginate(
      sortedItems,
      props.page,
      props.perPage
    )

    return new SearchResult({
      items: paginatedItems,
      total: filteredItems.length,
      currentPage: props.page,
      perPage: props.perPage,
      sort: props.sort,
      sortDir: props.sortDir,
      filter: props.filter,
    })
  }

  protected abstract applyFilter(
    items: E[],
    filter: SearchParams['filter'] | null
  ): Promise<E[]>

  protected async applySort(
    items: E[],
    sort: SearchParams['sort'] | null,
    sortDir: SearchParams['sortDir'] | null
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) return items
    if (sortDir !== 'ASC' && sortDir !== 'DESC') return items
    return [...items].sort((a: any, b: any) => {
      if (sortDir === 'ASC') {
        return a.props[sort] > b.props[sort] ? 1 : -1
      } else {
        return a.props[sort] > b.props[sort] ? -1 : 1
      }
    })
  }

  protected async applyPaginate(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage']
  ): Promise<E[]> {
    if (typeof page !== 'number' || typeof perPage !== 'number') return items
    if (page <= 0 || perPage <= 0) return items
    const start = (page - 1) * perPage
    const end = page * perPage
    return items.slice(start, end)
  }
}
