import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { IUser, UpdateUser } from '../Interfaces/user.interfaces'
import { BaseDTO } from './base.dto'

export class UserDTO extends BaseDTO implements IUser {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsEmail()
  @IsNotEmpty()
  email: string
}

export class UpdateUserDTO implements UpdateUser {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email: string
}
