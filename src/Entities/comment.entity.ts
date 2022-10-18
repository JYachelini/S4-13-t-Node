import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { ICommentDTO } from '../Interfaces/comment.interface'
import { BaseEntity } from './base.entity'
import { Post } from './post.entity'
import { Reply } from './reply.entity'
import { User } from './user.entity'

@Entity()
export class Comment extends BaseEntity implements ICommentDTO {
  @Column()
  comment: string

  @ManyToOne(() => User, user => user.comments)
  @JoinColumn()
  user: User

  @Column()
  userId: number

  @ManyToOne(() => Post, post => post.comments)
  @JoinColumn()
  post: Post

  @Column()
  postId: number

  @OneToMany(() => Reply, reply => reply.comment)
  replys: Reply[]
}
