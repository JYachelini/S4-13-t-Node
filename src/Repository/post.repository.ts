import { BaseRepository } from './base.repository'
import { IPost } from '../Interfaces/post.interfaces'
import { Post } from '../Entities/post.entity'
import { Query } from '../Interfaces/repository.interface'

export class PostRepository extends BaseRepository<IPost> {
  constructor() {
    super(Post)
  }

  async findWithComments(query: Query): Promise<IPost | null> {
    const builder = (await this.repository).createQueryBuilder('post')

    builder.leftJoinAndSelect('post.user', 'user')
    builder.leftJoinAndSelect('post.comments', 'comment')
    builder.leftJoinAndSelect('comment.user', 'user_comment')
    builder.leftJoinAndSelect('comment.replys', 'replys')
    builder.leftJoinAndSelect('replys.user', 'user_reply')

    builder.where(query)

    return await builder.getOne()
  }

  async findWithUser(query: Query): Promise<IPost | null> {
    const builder = (await this.repository).createQueryBuilder('post')

    builder.leftJoinAndSelect('post.user', 'user')

    return await builder.where(query).getOne()
  }

  async findWithLikes(query: Query): Promise<IPost | null> {
    const builder = (await this.repository).createQueryBuilder('post')

    builder.leftJoinAndSelect('post.likes', 'likes')

    return await builder.where(query).getOne()
  }

  async findWithFavorites(query: Query): Promise<IPost | null> {
    const builder = (await this.repository).createQueryBuilder('post')

    builder.leftJoinAndSelect('post.favorites', 'favorite')

    return await builder.where(query).getOne()
  }
}
