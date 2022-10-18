import { IPostDTO } from '../Interfaces/post.interfaces'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from './base.entity'
import { Like } from './like.entity'
import { Comment } from './comment.entity'
import { User } from './user.entity'
import { Favorite } from './favorite.entity'

@Entity()
export class Post extends BaseEntity implements IPostDTO {
  @Column()
  title: string

  @Column()
  media_url: string

  @Column({ type: 'text', array: true })
  tags: string[]

  @ManyToOne(() => User, user => user.post)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ default: 0 })
  likesCount: number

  @Column({ default: 0 })
  commentsCount: number

  @OneToMany(() => Like, like => like.post)
  likes: Like[]

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[]

  @OneToMany(() => Favorite, favorite => favorite.post)
  favorites: Favorite[]
}
