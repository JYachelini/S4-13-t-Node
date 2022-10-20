import { IPost, UpdatePost } from '../Interfaces/post.interfaces'
import { Query } from '../Interfaces/repository.interface'
import { PostRepository } from '../Repository/post.repository'
import { CommentService } from './comment.service'
import { FavoriteService } from './favorite.service'
import { LikeService } from './like.service'

export class PostService {
  private readonly alias: string
  private readonly relation: string
  constructor(
    private readonly postRepository: PostRepository = new PostRepository(),
    private readonly likeService: LikeService = new LikeService(),
    private readonly favoriteService: FavoriteService = new FavoriteService(),
    private readonly commentService: CommentService = new CommentService()
  ) {
    this.alias = 'post'
    this.relation = 'user'
  }
  async create(post: IPost) {
    return await this.postRepository.create(post)
  }
  async findAll(page: any = 1, size: any = 20, sort: any, word?: any) {
    const [posts, total] = await this.postRepository.list(this.alias, this.relation, {
      size,
      page,
      sort,
      word,
      property: 'title',
    })
    const last_page = Math.ceil(total / size)
    return [posts, total, last_page]
  }

  async find(query: Query, addSelect?: string) {
    return await this.postRepository.find(this.alias, query, addSelect)
  }

  async findWithUser(id: number) {
    return await this.postRepository.findWithUser({ id })
  }

  async findWithComments(id: number) {
    return await this.postRepository.findWithComments({ id })
  }

  async update(query: Query, data: UpdatePost) {
    const updated = await this.postRepository.update(data, query)
    if (updated.affected === 0) {
      return { error: 'Post not found or is deleted.' }
    }
    return { post: updated.raw }
  }

  async remove(id: number) {
    const deleted = await this.postRepository.remove({ id })
    if (deleted.affected === 0) {
      return { error: 'Post not found or already deleted.' }
    }
    return { post: deleted.raw }
  }

  async like(data: any) {
    const { userId, postId } = data
    // const post = await this.find({ id: data.post })
    const post = await this.postRepository.findWithLikes({ id: postId })
    if (!post) return { error: 'Post not found.' }

    const postLikes = post.likes!.map(like => {
      return like.userId
    })

    if (postLikes.includes(userId)) {
      this.likeService.delete({ userId, postId })
      // const deleted = await this.likeService.delete({ userId, postId })
      // if (deleted.error) return { error: `Error while deleting Like on post ${postId} from user ${userId}` }

      this.update({ id: postId }, { likesCount: post.likesCount - 1 })
      // const updated = await this.update({ id: postId }, { likesCount: post.likesCount - 1 })
      // if (updated.error) return { error: 'Error while decrease likeCount on post with id: ' + postId }
      return { liked: false, message: 'Like removed.', likesCount: post.likesCount - 1 }
    }

    this.likeService.create(data)

    this.update({ id: postId }, { likesCount: post.likesCount + 1 })
    // const updated = await this.update({ id: postId }, { likesCount: post.likesCount + 1 })
    // if (updated.error) return { error: 'Error while increment likeCount on post with id: ' + postId }

    return { liked: true, message: 'Like added.', likesCount: post.likesCount + 1 }
  }

  async favorite(data: any) {
    const { userId, postId } = data
    // const post = await this.find({ id: data.post })
    const post = await this.postRepository.findWithFavorites({ id: postId })
    if (!post) return { error: 'Post not found.' }

    const postFavorites = post.favorites!.map(favorite => {
      return favorite.userId
    })

    if (postFavorites.includes(userId)) {
      this.favoriteService.delete({ userId, postId })
      // const deleted = await this.likeService.delete({ userId, postId })
      // if (deleted.error) return { error: `Error while deleting Like on post ${postId} from user ${userId}` }

      this.update({ id: postId }, { likesCount: post.likesCount - 1 })
      // const updated = await this.update({ id: postId }, { likesCount: post.likesCount - 1 })
      // if (updated.error) return { error: 'Error while decrease likeCount on post with id: ' + postId }
      return { favorited: false, message: 'Post removed from favorites.' }
    }

    this.favoriteService.create(data)

    this.update({ id: postId }, { likesCount: post.likesCount + 1 })
    // const updated = await this.update({ id: postId }, { likesCount: post.likesCount + 1 })
    // if (updated.error) return { error: 'Error while increment likeCount on post with id: ' + postId }

    return { favorited: true, message: 'Post added to favorites.' }
  }

  async comment(data: any) {
    const post = await this.find({ id: data.postId })
    if (!post) return { error: 'Post not found.' }

    this.commentService.create(data)

    this.update({ id: data.postId }, { commentsCount: post.commentsCount + 1 })
    // const updated = await this.update({ id: data.postId }, { commentsCount: post.commentsCount + 1 })
    // if (updated.error) return { error: 'Error while increment likeCount on post with id: ' + data.postId }

    return { commented: true, message: 'Comment added.', commentsCount: post.commentsCount + 1 }
  }
}
