import { IPostDTO } from '../Interfaces/post.interfaces'
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'
import { BaseDTO } from './base.dto'

export class PostDTO extends BaseDTO implements IPostDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  title: string

  @IsArray()
  @IsNotEmpty()
  tags: string[]

  @IsUrl()
  @IsNotEmpty()
  media_url: string

  // @IsNumber()
  // @IsNotEmpty()
  // user: User
}

const sort = ['asc', 'desc', 'like', 'random']

export class getPostRequest {
  @IsOptional()
  @Min(1)
  page: any

  @IsOptional()
  @Min(1)
  size: any

  @IsOptional()
  @MinLength(3)
  @MaxLength(6)
  @IsIn(sort)
  sort: any
}

export class updatePostRequest {
  @IsOptional()
  @IsNotEmpty()
  @MinLength(3)
  title: string

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  tags: string[]
}
