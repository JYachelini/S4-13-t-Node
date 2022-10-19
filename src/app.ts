import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import swaggerUI from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'
import { ConfigServer } from './Config/config'
import { PostRouter } from './Routes/post.routes'
import { UserRouter } from './Routes/user.routes'
import { LoginStrategy } from './Strategies/login.strategy'
import { JwtStrategy } from './Strategies/jwt.strategy'
import { AuthRouter } from './Routes/auth.routes'
import { CommentRouter } from './Routes/comment.routes'

export class Server extends ConfigServer {
  public app: express.Application = express()
  private port: number = this.getNumberEnv('PORT')

  constructor() {
    super()
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    this.passportUse()

    this.dbConnect()
      .then(() => {
        console.log('Database connected.')
      })
      .catch(err => console.log(err))

    this.app.get('/', (req, res) => {
      res.send('<a href="/login/google">Google</a><a href="/login/facebook">Facebook</a>') // Para probar el login de google
    })
    this.app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

    this.app.use(morgan('dev'))
    this.app.use(cors({ credentials: true, origin: true }))

    this.app.use(this.routers())
    this.listen()
  }

  passportUse() {
    return [new LoginStrategy().use, new JwtStrategy().use]
  }

  routers(): express.Router[] {
    return [new PostRouter().router, new UserRouter().router, new AuthRouter().router, new CommentRouter().router]
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log('Server listening on port', this.port)
    })
  }
}
