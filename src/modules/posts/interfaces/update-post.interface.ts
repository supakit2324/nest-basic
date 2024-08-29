import { PostsStatusEnum } from '../enums/posts-status.enum'

export interface UpdatePostInterface {
  title: string
  description?: string
  status: PostsStatusEnum
}
