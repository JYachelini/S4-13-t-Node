import { DeleteResult, IsNull } from 'typeorm'
import { Reply } from '../Entities/reply.entity'
import { Query } from '../Interfaces/repository.interface'
import { IReply } from '../Interfaces/reply.interface'
import { BaseRepository } from './base.repository'

export class ReplyRepository extends BaseRepository<IReply> {
  constructor() {
    super(Reply)
  }

  async findWithUser(query: Query): Promise<IReply | null> {
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
