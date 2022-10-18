import { Query } from '../Interfaces/repository.interface'
import { IReply } from '../Interfaces/reply.interface'
import { ReplyRepository } from '../Repository/reply.repository'
import { BaseService } from './base.service'

export class ReplyService extends BaseService {
  private readonly alias
  constructor(private readonly replyRepository: ReplyRepository = new ReplyRepository()) {
    super()
    this.alias = 'reply'
  }

  async create(data: IReply) {
    return await this.replyRepository.create(data)
  }

  async find(query: Query, addSelect?: string) {
    return await this.replyRepository.find(this.alias, query, addSelect)
  }

  async findWithUser(query: Query) {
    return await this.replyRepository.findWithUser(query)
  }

  async delete(query: Query) {
    const deleted = await this.replyRepository.delete(query)
    if (deleted.affected === 0) {
      return { error: 'Comment not found or already deleted.' }
    }
    return { comment: deleted.raw }
  }
}
