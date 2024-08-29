import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Comments } from './schemas/comments.schema'

import { MONGOOSE_CONNECTION_NAME } from '../../constants'

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name, MONGOOSE_CONNECTION_NAME)
    private readonly commentsModel: Model<Comments>,
  ) {}
}
