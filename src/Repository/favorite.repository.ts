import { BaseRepository } from './base.repository'
import { IFavorite } from '../Interfaces/favorite.interface'
import { Favorite } from '../Entities/favorite.entity'

export class FavoriteRepository extends BaseRepository<IFavorite> {
  constructor() {
    super(Favorite)
  }
}
