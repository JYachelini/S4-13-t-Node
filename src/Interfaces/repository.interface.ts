import { BaseEntity } from '../Entities/base.entity'
import { UpdateResult } from 'typeorm'

export type Query = Record<string, any>

export interface SetsList {
  size: number
  page: number
  sort: any
  word?: string
  property?: string
  tag?: string
}

export type Id = number

export interface DatabaseRepository<Entity extends BaseEntity> {
  create(data: Entity): Promise<Entity>
  list(alias: string, relation?: string, sets?: SetsList): Promise<[Entity[], number]>
  find(alias: string, query?: Query, addSelect?: string): Promise<Entity | null>
  update(data: Partial<Entity>, query?: Query): Promise<UpdateResult>
  remove(query?: Query): Promise<UpdateResult>
}
