import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IReplyDTO } from '../Interfaces/reply.interface'
import { BaseEntity } from './base.entity'
import { Comment } from './comment.entity'
import { User } from './user.entity'

@Entity()
export class Reply extends BaseEntity implements IReplyDTO {
  @Column()
  reply: string

  @ManyToOne(() => User, user => user.replys)
  @JoinColumn()
  user?: User

  @Column()
  userId: number

  @ManyToOne(() => Comment, comment => comment.replys)
  @JoinColumn()
  comment?: Comment

  @Column()
  commentId: number
}
