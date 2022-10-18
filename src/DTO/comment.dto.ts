import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { ICommentDTO } from '../Interfaces/comment.interface'
import { BaseDTO } from './base.dto'

export class CommentDTO extends BaseDTO implements ICommentDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  comment: string
}
