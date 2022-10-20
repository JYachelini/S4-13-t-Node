import { BaseRepository } from './base.repository'
import { ILike } from '../Interfaces/like.interface'
import { Like } from '../Entities/like.entity'

export class LikeRepository extends BaseRepository<ILike> {
  constructor() {
    super(Like)
  }
}
