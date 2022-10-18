import { BaseRepository } from './base.repository'
import { ILike } from '../Interfaces/like.interface'
import { Like } from '../Entities/like.entity'
import { DeleteResult, IsNull } from 'typeorm'
import { Query } from '../Interfaces/repository.interface'

export class LikeRepository extends BaseRepository<ILike> {
  constructor() {
    super(Like)
  }

  async delete(query: Query): Promise<DeleteResult> {
    const { raw, affected } = await (
      await this.repository
    )
      .createQueryBuilder()
      .delete()
      .where({ ...query, deleted_at: IsNull() })
      .returning('*')
      .execute()

    return { raw, affected }
  }
}
