import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { QueryCommentInterface } from './interfaces/query-comment.interface'
import { Comments } from './schemas/comments.schema'

import { MONGOOSE_CONNECTION_NAME } from '../../constants'

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name, MONGOOSE_CONNECTION_NAME)
    private readonly commentsModel: Model<Comments>,
  ) {}

  create = async (payload: Comments): Promise<Comments> => {
    return this.commentsModel.create(payload)
  }

  getByObjectId = async (objectId: string): Promise<Comments> => {
    return this.commentsModel.findOne({ objectId })
  }

  getCommentsByPosts = async (postsId: string): Promise<Comments[]> => {
    return this.commentsModel
      .find({ 'posts.objectId': postsId })
      .sort({ createdAt: -1 })
      .lean()
  }

  updateComment = async (payload: {
    query: QueryCommentInterface
    update: { comment: string }
  }): Promise<Comments> => {
    const { query, update } = payload
    const filter = {
      objectId: query.commentId,
      'user.userId': query.userId,
      'posts.objectId': query.postId,
    }
    return this.commentsModel.findOneAndUpdate(filter, update, { new: true })
  }

  deleteComment = async (payload: QueryCommentInterface): Promise<Comments> => {
    const { commentId, userId, postId } = payload
    const filter = {
      objectId: commentId,
      'user.userId': userId,
      'posts.objectId': postId,
    }
    return this.commentsModel.findOneAndDelete(filter)
  }
}
