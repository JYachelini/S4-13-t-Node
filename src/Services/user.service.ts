import { Query } from '../Interfaces/repository.interface'
import { CreateUserDTO, RoleTypes, UpdateUser } from '../Interfaces/user.interfaces'
import { UserRepository } from '../Repository/user.repository'
import { BaseService } from './base.service'

export class UserService extends BaseService {
  private readonly alias: string
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {
    super()
    this.alias = 'user'
  }

  async create(user: CreateUserDTO) {
    const newUser = (await this.userRepository.repository).create(user)
    if (user.password) {
      newUser.password = await this.encrypt(user.password)
    }
    return await this.userRepository.create(newUser)
  }

  async findAll(page: number, size: number, sort: string) {
    const [users, total] = await this.userRepository.list(this.alias, undefined, { size, page, sort })
    const last_page = Math.ceil(total / size)
    return [users, total, last_page]
  }

  async find(query: Query, addSelect?: string) {
    return await this.userRepository.find(this.alias, query, addSelect)
  }

  async findByIdWithPosts(id: number, page: number, size: number, sort: string) {
    return await this.userRepository.findWithPosts({ id }, { page, size, sort })
  }

  async findByIdWithFavorites(id: number, page: number, size: number, sort: string) {
    return await this.userRepository.findWithFavorites({ id }, { page, size, sort })
  }

  async findByIdWithLikes(id: number, page: number, size: number, sort: string) {
    return await this.userRepository.findWithLikes({ id }, { page, size, sort })
  }

  async findByIdWithRole(id: number, role: RoleTypes[]) {
    return await this.userRepository.findWithRole(id, role)
  }

  async update(query: Query, user: UpdateUser) {
    if (user.password) {
      const hash = await this.encrypt(user.password)
      user.password = hash
    }
    const updated = await this.userRepository.update(user, query)
    if (updated.affected === 0) {
      return { error: 'User not found or is deleted.' }
    }
    return { user: updated.raw }
  }

  async remove(id: number) {
    const deleted = await this.userRepository.remove({ id })
    if (deleted.affected === 0) {
      return { error: 'User not found or already deleted.' }
    }
    return { user: deleted.raw }
  }

  // async findByUsername(username: string) {
  //   return await this.userRepository.find(this.alias, { username }, 'password')
  // }

  // async findByEmail(email: string) {
  //   return await this.userRepository.find(this.alias, { email }, 'password')
  // }

  // async findByFacebookID(facebook_id: string) {
  //   return await this.userRepository.find(this.alias, { facebook_id })
  // }

  // async findByGoogleID(google_id: number) {
  //   return await this.userRepository.find(this.alias, { google_id })
  // }
}
