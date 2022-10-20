import { User } from '../Entities/user.entity'
import { Query, SetsList } from '../Interfaces/repository.interface'
import { IUser, RoleTypes } from '../Interfaces/user.interfaces'
import { BaseRepository } from './base.repository'

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User)
  }

  async findWithPosts(query: Query, sets?: SetsList): Promise<IUser | null> {
    const { page, size, sort } = sets!

    return await (
      await this.repository
    )
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.post', 'post')
      .loadRelationCountAndMap('user.total_posts', 'user.post')
      .loadRelationCountAndMap('user.total_likes', 'user.likes')
      .where(query)
      .offset((page - 1) * size)
      .limit(size)
      .orderBy('post.created_at', sort.toUpperCase())
      .getOne()
  }

  async findWithLikes(query: Query, sets?: SetsList): Promise<IUser | null> {
    const { page, size, sort } = sets!

    return await (
      await this.repository
    )
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.likes', 'likes')
      .leftJoinAndSelect('likes.post', 'post')
      .where(query)
      .offset((page - 1) * size)
      .limit(size)
      .orderBy('user.created_at', sort.toUpperCase())
      .getOne()
  }

  async findWithFavorites(query: Query, sets?: SetsList): Promise<IUser | null> {
    const { page, size, sort } = sets!

    return await (
      await this.repository
    )
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.favorites', 'favorites')
      .leftJoinAndSelect('favorites.post', 'post')
      .leftJoinAndSelect('post.user', 'user_post')
      .where(query)
      .offset((page - 1) * size)
      .limit(size)
      .orderBy('user.created_at', sort.toUpperCase())
      .getOne()
  }

  async findWithRole(id: number, role: RoleTypes[]): Promise<IUser | null> {
    return (await this.repository).createQueryBuilder('user').where({ id }).andWhere({ role }).getOne()
  }
  // async findByIdWithRefreshToken(id: number): Promise<IUser | null> {
  //   return await (await this.repository)
  //     .createQueryBuilder('user')
  //     .addSelect('user.refresh_token')
  //     .where({ id })
  //     .getOne()
  // }

  // async findUserByUsername(username: string): Promise<IUser | null> {
  //   return (await this.repository).createQueryBuilder('user').addSelect('user.password').where({ username }).getOne()
  // }

  // async findUserByEmail(email: string): Promise<IUser | null> {
  //   return (await this.repository).createQueryBuilder('user').addSelect('user.password').where({ email }).getOne()
  // }

  // async findUserByGoogleID(id: string): Promise<IUser | null> {
  //   return await (await this.repository).createQueryBuilder('user').where({ google_id: id }).getOne()
  // }

  // async findUserByFacebookID(id: string): Promise<IUser | null> {
  //   return (await this.repository).createQueryBuilder('user').where({ facebook_id: id }).getOne()
  // }
}
