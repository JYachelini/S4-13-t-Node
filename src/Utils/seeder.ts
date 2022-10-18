import { faker } from '@faker-js/faker'
import { DataSource } from 'typeorm'
import { ConfigServer } from '../Config/config'
import { Post } from '../Entities/post.entity'
import { User } from '../Entities/user.entity'
import * as bcrypt from 'bcryptjs'
import { RoleTypes } from '../Interfaces/user.interfaces'
import { Comment } from '../Entities/comment.entity'
import { Reply } from '../Entities/reply.entity'
class Seeder extends ConfigServer {
  constructor() {
    super()
    this.main()
  }

  async createUser(dataSource: DataSource) {
    const user = dataSource.getRepository(User)
    const count = await user.count()

    if (count > 0) return

    const password_hash = await bcrypt.hash('12345678', 10)

    await user.save({
      username: 'yache',
      password: password_hash,
      email: 'juliyache@test.com',
      role: [RoleTypes.ADMIN, RoleTypes.USER],
    })
    console.log(`User yache created`)

    await user.save({
      username: 'admin',
      password: password_hash,
      email: 'admin@test.com',
      role: [RoleTypes.ADMIN, RoleTypes.USER],
    })
    console.log(`User admin created`)

    await user.save({
      username: 'user',
      password: password_hash,
      email: 'user@test.com',
      role: [RoleTypes.USER],
    })
    console.log(`User common created`)
  }

  async createPosts(dataSource: DataSource) {
    const post = dataSource.getRepository(Post)
    const count = await post.count()
    if (count > 0) return

    for (let i = 0; i < 50; i++) {
      const posts = post.create({
        title: faker.commerce.productName(),
        media_url: faker.image.cats(),
        tags: [faker.commerce.department()],
        user: {
          id: 1,
        },
      })
      await post.save(posts)
      console.log(`Post ${i} created`)
    }
  }

  async createComments(dataSource: DataSource) {
    const comment = dataSource.getRepository(Comment)
    const postCount = await dataSource.getRepository(Post).count()

    const count = await comment.count()
    if (count > 0) return

    for (let i = 0; i < postCount; i++) {
      for (let j = 0; j < 2; j++) {
        const comments = comment.create({
          comment: `Test comment ${j}`,
          postId: i + 1,

          userId: 1,
        })
        await comment.save(comments)
        console.log(`Comment ${j} in Post ${i} created.`)
      }
    }
  }

  async createReplys(dataSource: DataSource) {
    const reply = dataSource.getRepository(Reply)
    const commentCount = await dataSource.getRepository(Comment).count()
    const count = await reply.count()
    if (count > 0) return

    for (let i = 0; i < commentCount; i++) {
      for (let j = 0; j < 2; j++) {
        const replys = reply.create({
          reply: `Test reply ${j}`,
          userId: 1,

          commentId: i + 2,
        })
        await reply.save(replys)
        console.log(`Reply ${j} in Comment ${i} created.`)
      }
    }
  }

  async main() {
    const dataSource = await this.dbConnect()
    await this.createUser(dataSource)
    await this.createPosts(dataSource)
    await this.createComments(dataSource)
    await this.createReplys(dataSource)
    process.exit()
  }
}

new Seeder()
