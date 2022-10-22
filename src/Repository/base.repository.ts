import { BaseEntity } from '../Entities/base.entity'
import { DatabaseRepository, Query, SetsList } from '../Interfaces/repository.interface'
import { DeleteResult, EntityTarget, IsNull, Repository, UpdateResult } from 'typeorm'
import { ConfigServer } from '../Config/config'

export class BaseRepository<T extends BaseEntity> extends ConfigServer implements DatabaseRepository<T> {
  public repository: Promise<Repository<T>>
  constructor(private entity: EntityTarget<T>) {
    super()

    this.repository = this.initRepository()
  }

  async initRepository<T>() {
    const getConn = await this.dbConnect()
    return getConn.getRepository(this.entity)
  }

  async create(data: T): Promise<T> {
    const builder = (await this.repository).create(data)
    return (await this.repository).save(builder)
  }

  async list(alias: string, relation?: string, sets?: SetsList): Promise<[T[], number]> {
    const { size, page, sort, word, property, tag } = sets!

    const builder = (await this.repository).createQueryBuilder(alias)

    if (relation) {
      builder.leftJoinAndSelect(`${alias}.${relation}`, relation)
    }

    builder.offset((page - 1) * size).limit(size)

    if (sort === 'random') builder.orderBy('RANDOM()')

    if (sort === 'desc' || sort === 'asc') builder.orderBy(`${alias}.created_at`, sort.toUpperCase())

    if (sort === 'like') builder.orderBy(`${alias}.likesCount`, 'DESC')

    if (word && property) {
      builder.where(`LOWER(${alias}.${property}) Like LOWER('%${word}%')`)
    }

    if (tag) {
      builder.where(`${alias}.tags && (ARRAY[:...tags])`, { tags: [tag.toUpperCase()] })
    }

    const [list, total] = await builder.getManyAndCount()
    return [list, total]
  }

  async find(alias: string, query?: Query | undefined, addSelect?: string): Promise<T | null> {
    const builder = (await this.repository).createQueryBuilder(alias)
    if (addSelect) builder.addSelect(`${alias}.${addSelect}`)

    return await builder.where({ ...query, deleted_at: IsNull() }).getOne()
  }

  async update(data: any, query?: Query | undefined): Promise<UpdateResult> {
    const builder = await (
      await this.repository
    )
      .createQueryBuilder()
      .update(data)
      .where({ ...query, deleted_at: IsNull() })
      .returning('*')
      .execute()

    return builder
  }

  async remove(query?: Query | undefined): Promise<UpdateResult> {
    const builder = await (
      await this.repository
    )
      .createQueryBuilder()
      .softDelete()
      .where({ ...query, deleted_at: IsNull() })
      .returning('*')
      .execute()
    return builder
  }

  async delete(query: Query): Promise<DeleteResult> {
    const { raw, affected } = await (
      await this.repository
    )
      .createQueryBuilder()
      .delete()
      .where({ ...query, deleted_at: IsNull() })
      .returning('*')
      .execute()

    return { raw, affected }
  }
}
