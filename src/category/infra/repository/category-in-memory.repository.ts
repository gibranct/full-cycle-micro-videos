import { CategoryRepository } from './../../domain/repository/category.repository'
import { Category } from './../../domain/entities/category'
import { InMemorySearchableRepository } from './../../../@seedwork/domain/repository/in-memory.repository'

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository
{
  sortableFields: string[] = ['name', 'createdAt']
  protected async applyFilter(
    items: Category[],
    filter: string
  ): Promise<Category[]> {
    if (!filter) return items

    return items.filter((item) => {
      return item.props.name.toLowerCase().includes(filter.toLowerCase())
    })
  }

  protected async applySort(
    items: Category[],
    sort: string,
    sortDir: string
  ): Promise<Category[]> {
    if (!sort) {
      return super.applySort(items, 'createdAt', 'DESC')
    }
    return super.applySort(items, sort, sortDir as any)
  }
}
