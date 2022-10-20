import { UserController } from '../Controllers/user.controller'
import { UserMiddleware } from '../Middleware/user.middleware'
import { BaseRouter } from './base.routes'

export class UserRouter extends BaseRouter<UserController, UserMiddleware> {
  constructor() {
    super(UserController, UserMiddleware)
  }

  routes(): void {
    this.router.post(
      '/register',
      (req, res, next) => this.middleware.registerValidator(req, res, next),
      (req, res) => this.controller.create(req, res)
    )

    this.router.route('/user').get(
      this.middleware.passAuth('jwt', { session: false }),
      (req, res, next) => this.middleware.checkAdminRole(req, res, next),
      (req, res) => {
        this.controller.findAll(req, res)
      }
    )

    this.router.get(
      '/myinfo',
      this.middleware.passAuth('jwt', { session: false }),
      (req, res, next) => this.middleware.getAccessToken(req, res, next),
      (req, res) => this.controller.getByAccessToken(req, res)
    )

    this.router
      .route('/user/:id')
      .get((req, res) => {
        this.controller.findWithPosts(req, res)
      })
      .put(
        this.middleware.passAuth('jwt', { session: false }),
        (req, res, next) => this.middleware.checkUserIsUserOwner(req, res, next),
        (req, res, next) => this.middleware.updateValidator(req, res, next),
        (req, res) => {
          this.controller.update(req, res)
        }
      )
      .delete(
        this.middleware.passAuth('jwt', { session: false }),
        (req, res, next) => this.middleware.checkUserIsUserOwner(req, res, next),
        (req, res) => {
          this.controller.remove(req, res)
        }
      )

    this.router.get('/user/:id/cantLikes', (req, res) => {
      this.controller.countLikes(req, res)
    })

    this.router.route('/user/:id/posts').get((req, res) => {
      this.controller.findWithPosts(req, res)
    })

    this.router.route('/user/:id/likes').get((req, res) => {
      this.controller.findWithLikes(req, res)
    })

    this.router.route('/user/:id/favorites').get((req, res) => {
      this.controller.findWithFavorites(req, res)
    })
  }
}
