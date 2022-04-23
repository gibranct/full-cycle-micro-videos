import { UniqueEntityId } from './../value-objects/unique-entity-id.vo'
import { Entity } from '../entity/entity'

export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<void>
  findById(id: string | UniqueEntityId): Promise<E>
  findAll(): Promise<E[]>
  update(entity: E): Promise<void>
  delete(id: string | UniqueEntityId): Promise<void>
}

export type SortDirection = 'ASC' | 'DESC'

export type SearchProps<Filter = string> = {
  page?: number | null
  perPage?: number | null
  sort?: string | null
  sortDir?: SortDirection | null
  filter?: Filter | null
}

export class SearchParams<Filter = string> {
  protected _page: number
  protected _perPage: number = 15
  protected _sort: string | null
  protected _sortDir: SortDirection | null
  protected _filter: Filter | null

  constructor(props: SearchProps<Filter> = {}) {
    this.page = props.page || 1
    this.perPage = props.perPage || 15
    this.sort = props.sort || null
    this.sortDir = props.sortDir || null
    this.filter = props.filter || null
  }

  get page(): number {
    return this._page
  }

  private set page(value: number) {
    let _page = +value
    if (
      Number.isNaN(_page) ||
      _page <= 0 ||
      Number.parseInt(`${_page}`) !== _page
    ) {
      _page = 1
    }
    this._page = _page
  }

  get perPage(): number {
    return this._perPage
  }

  private set perPage(value: number) {
    let _perPage = value === (true as any) ? this._perPage : +value
    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      Number.parseInt(`${_perPage}`) !== _perPage
    ) {
      _perPage = 1
    }
    this._perPage = _perPage
  }

  get sort(): string | null {
    return this._sort
  }

  private set sort(value: string | null) {
    const isValid = !['', 'undefined', 'null'].includes(`${value}`)
    this._sort = isValid ? `${value}` : null
  }

  get sortDir(): SortDirection | null {
    return this._sortDir
  }

  private set sortDir(value: string | null) {
    const isValid = !['', 'undefined', 'null'].includes(`${value}`)
    if (!isValid) {
      this._sortDir = !!this.sort ? 'ASC' : null
      return
    }
    const dir = `${value}`.toUpperCase()
    this._sortDir = ['ASC', 'DESC'].includes(dir) ? dir : ('ASC' as any)
  }

  get filter(): Filter | null {
    return this._filter
  }

  private set filter(value: Filter | null) {
    const isValid = !['', 'undefined', 'null'].includes(`${value}`)
    this._filter = isValid ? (`${value}` as any) : null
  }
}

export type SearchResultProps<E extends Entity, Filter> = {
  items: E[]
  total: number
  currentPage: number
  perPage: number
  sort: string | null
  sortDir: string | null
  filter: Filter | null
}

export class SearchResult<
  E extends Entity<any> = Entity<any>,
  Filter = string
> {
  readonly items: E[]
  readonly total: number
  readonly currentPage: number
  readonly perPage: number
  readonly lastPage: number
  readonly sort: string | null
  readonly sortDir: string | null
  readonly filter: Filter

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items
    this.total = props.total
    this.currentPage = props.currentPage
    this.perPage = props.perPage
    this.lastPage = Math.ceil(this.total / this.perPage)
    this.sort = props.sort
    this.sortDir = props.sortDir
    this.filter = props.filter
  }

  toJSON() {
    return {
      items: this.items,
      total: this.total,
      currentPage: this.currentPage,
      perPage: this.perPage,
      lastPage: this.lastPage,
      sort: this.sort,
      sortDir: this.sortDir,
      filter: this.filter,
    }
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  Filter = string,
  SearchInput = SearchParams,
  SearchOutput = SearchResult<E, Filter>
> extends RepositoryInterface<E> {
  sortableFields: string[]
  search(props: SearchInput): Promise<SearchOutput>
}
