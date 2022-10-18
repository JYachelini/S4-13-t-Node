import { Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm'
import { User } from './user.entity'
import { Post } from './post.entity'
import { ILikeDTO } from '../Interfaces/like.interface'
import { BaseEntity } from './base.entity'
@Entity()
export class Like extends BaseEntity implements ILikeDTO {
  @ManyToOne(() => User, user => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Post, post => post.likes)
  @JoinColumn({ name: 'post_id' })
  post: Post
}
