import { IBaseDTO } from '../Interfaces/base.interfaces'
import { IsDate, IsOptional } from 'class-validator'

export class BaseDTO implements IBaseDTO {
  @IsOptional()
  id: number

  @IsDate()
  @IsOptional()
  created_at: Date

  @IsDate()
  @IsOptional()
  updated_at: Date

  @IsDate()
  @IsOptional()
  deleted_at: Date
}
