import { BaseRepository } from './base.repository'
import { IComment } from '../Interfaces/comment.interface'
import { Comment } from '../Entities/comment.entity'
import { DeleteResult, IsNull } from 'typeorm'
import { Query } from '../Interfaces/repository.interface'

export class CommentRepository extends BaseRepository<IComment> {
  constructor() {
    super(Comment)
  }

  async findWithUser(query: Query): Promise<IComment | null> {
    const builder = (await this.repository).createQueryBuilder('comment')

    builder.leftJoinAndSelect('comment.user', 'user')

    builder.where(query)

    return await builder.getOne()
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
