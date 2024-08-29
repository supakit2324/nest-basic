import { Injectable, Logger } from '@nestjs/common'
import { tryit } from 'radash'

import { UpdatePostInterface } from '../interfaces/update-post.interface'
import { PostsService } from '../posts.service'
import { Posts } from '../schemas/posts.schema'

@Injectable()
export class UpdatePostUseCase {
  private readonly logger = new Logger(UpdatePostUseCase.name)
  constructor(private readonly postsService: PostsService) {}

  execute = async (post: Posts): Promise<Posts> => {
    const update: UpdatePostInterface = {
      title: post.title,
      description: post.description,
      status: post.status,
    }
    const [err, posts] = await tryit(this.postsService.updatePost)({
      post,
      update,
    })
    if (err) {
      this.logger.error(
        `Catch on update posts: ${JSON.stringify(
          post,
        )}, error: ${err.message ?? JSON.stringify(err)}`,
      )
    }

    return posts
  }
}
