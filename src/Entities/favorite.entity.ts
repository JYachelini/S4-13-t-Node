import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IFavoriteDTO } from '../Interfaces/favorite.interface'
import { BaseEntity } from './base.entity'
import { Post } from './post.entity'
import { User } from './user.entity'

@Entity()
export class Favorite extends BaseEntity implements IFavoriteDTO {
  @ManyToOne(() => User, user => user.favorites)
  @JoinColumn()
  user: User

  @Column()
  userId: number

  @ManyToOne(() => Post, post => post.favorites)
  @JoinColumn()
  post: Post

  @Column()
  postId: number
}
