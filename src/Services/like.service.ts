import { ILike } from '../Interfaces/like.interface'
import { Query } from '../Interfaces/repository.interface'
import { LikeRepository } from '../Repository/like.repository'
import { BaseService } from './base.service'

export class LikeService extends BaseService {
  private readonly alias
  constructor(private readonly likeRepository: LikeRepository = new LikeRepository()) {
    super()
    this.alias = 'like'
  }

  async create(data: ILike) {
    return await this.likeRepository.create(data)
  }

  async find(query: Query, addSelect?: string) {
    return await this.likeRepository.find(this.alias, query, addSelect)
  }

  async delete(query: Query) {
    const deleted = await this.likeRepository.delete(query)
    if (deleted.affected === 0) {
      return { error: 'Like not found or already deleted.' }
    }
    return { like: deleted.raw }
  }
}
