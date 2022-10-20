import { ILike } from '../Interfaces/like.interface'
import { Query } from '../Interfaces/repository.interface'
import { FavoriteRepository } from '../Repository/favorite.repository'
import { BaseService } from './base.service'

export class FavoriteService extends BaseService {
  private readonly alias
  constructor(private readonly favoriteRepository: FavoriteRepository = new FavoriteRepository()) {
    super()
    this.alias = 'favorite'
  }

  async create(data: ILike) {
    return await this.favoriteRepository.create(data)
  }

  async find(query: Query, addSelect?: string) {
    return await this.favoriteRepository.find(this.alias, query, addSelect)
  }

  async delete(query: Query) {
    const deleted = await this.favoriteRepository.delete(query)
    if (deleted.affected === 0) {
      return { error: 'Favorite not found or already deleted.' }
    }
    return { like: deleted.raw }
  }
}
