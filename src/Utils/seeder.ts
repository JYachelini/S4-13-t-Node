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

    // for (let i = 0; i < 50; i++) {
    //   const posts = post.create({
    //     title: faker.commerce.productName(),
    //     media_url: faker.image.cats(),
    //     tags: [faker.commerce.department().toUpperCase()],
    //     user: {
    //       id: 1,
    //     },
    //   })
    //   await post.save(posts)
    //   console.log(`Post ${i} created`)
    // }
    await post.save({
      title: 'mono simp',
      media_url: 'https://images3.memedroid.com/images/UPLOADED520/608176531eceb.jpeg',
      tags: ['memes de la urss'],
      user: { id: 1 },
    })

    await post.save({
      title: 'pendejos',
      media_url: 'https://images7.memedroid.com/images/UPLOADED273/60860fbc7d3ee.jpeg',
      tags: ['basado en hechos reales'],
      user: { id: 1 },
    })
    await post.save({
      title: 'Cuanta razon',
      media_url: 'https://images3.memedroid.com/images/UPLOADED948/6036c4c39cbe3.jpeg',
      tags: ['basado'],
      user: { id: 1 },
    })
    await post.save({
      title: 'todo bien en casa con este?',
      media_url: 'https://images3.memedroid.com/images/UPLOADED151/60971fd40e8ca.jpeg',
      tags: ['basado'],
      user: { id: 1 },
    })
    await post.save({
      title: 'Pasa.',
      media_url: 'https://images3.memedroid.com/images/UPLOADED935/6036e4908e4b5.jpeg',
      tags: ['Android', 'iPhone', 'Carga'],
      user: { id: 1 },
    })
    await post.save({
      title: 'Bueno para algo servira jugar tanto cod',
      media_url: 'https://images7.memedroid.com/images/UPLOADED946/60e3375e8b12f.jpeg',
      tags: ['Rocket league', 'kim jong un', 'online', 'videojuegos'],
      user: { id: 1 },
    })
    await post.save({
      title: 'le tiene ganas',
      media_url: 'https://images3.memedroid.com/images/UPLOADED465/603ec250b2ae4.jpeg',
      tags: ['batman'],
      user: { id: 1 },
    })
    await post.save({
      title: 'lo hice con amor, asi como su abuela cada vez que les prepara la cena',
      media_url: 'https://images7.memedroid.com/images/UPLOADED224/6022f0e6b7895.jpeg',
      tags: ['disney', 'perro', 'Smile dog'],
      user: { id: 1 },
    })
    await post.save({
      title: 'Ergo',
      media_url: 'https://images3.memedroid.com/images/UPLOADED256/60fd7588991b6.jpeg',
      tags: ['Ergo'],
      user: { id: 1 },
    })
    await post.save({
      title: 'C pueden m0rir',
      media_url: 'https://images3.memedroid.com/images/UPLOADED172/6078c0130d888.jpeg',
      tags: ['basado'],
      user: { id: 1 },
    })
    await post.save({
      title: 'Creo que es muy obvio a quien le queda mejor',
      media_url: 'https://images7.memedroid.com/images/UPLOADED555/60d4c39f4559e.jpeg',
      tags: ['Netflix', 'youtube', 'homero', 'simpsons', 'Los Simpsons'],
      user: { id: 1 },
    })
    await post.save({
      title: 'Seh',
      media_url: 'https://images3.memedroid.com/images/UPLOADED258/5f9ecc5855e6e.jpeg',
      tags: ['madre', 'compras', 'padre'],
      user: { id: 1 },
    })
    await post.save({
      title: 'Eso',
      media_url: 'https://images3.memedroid.com/images/UPLOADED285/606c99a604038.jpeg',
      tags: ['jet'],
      user: { id: 1 },
    })
    await post.save({
      title: 'tia may...',
      media_url: 'https://images7.memedroid.com/images/UPLOADED492/61786b508c515.jpeg',
      tags: ['hombre araña', 'araña', 'tia may'],
      user: { id: 1 },
    })
    await post.save({
      title: '*un solo de piano salvaje empieza a sonar*',
      media_url: 'https://images7.memedroid.com/images/UPLOADED599/606e487d78501.jpeg',
      tags: ['Zelda', 'Zelda BOTW'],
      user: { id: 1 },
    })
    await post.save({
      title: 'Hola',
      media_url: 'https://images3.memedroid.com/images/UPLOADED363/5fca4f3ac26b5.jpeg',
      tags: ['matematicas', 'vegeta', 'escuela'],
      user: { id: 1 },
    })
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
