import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IFavoriteDTO } from '../Interfaces/favorite.interface'
import { BaseEntity } from './base.entity'
import { Post } from './post.entity'
import { User } from './user.entity'

@Entity()
export class Favorite extends BaseEntity implements IFavoriteDTO {
  @ManyToOne(() => User, user => user.favorites)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Post, post => post.favorites)
  @JoinColumn({ name: 'post_id' })
  post: Post
}
