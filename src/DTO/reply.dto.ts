import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { IReplyDTO } from '../Interfaces/reply.interface'
import { BaseDTO } from './base.dto'

export class ReplyDTO extends BaseDTO implements IReplyDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  reply: string
}
