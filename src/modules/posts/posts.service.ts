import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import { FilterQuery, Model, PipelineStage } from 'mongoose'

import { UpdatePostInterface } from './interfaces/update-post.interface'
import { Posts } from './schemas/posts.schema'

import { MONGOOSE_CONNECTION_NAME } from '../../constants'
import { PaginationResponseInterface } from '../../interfaces/pagination-response.interface'
import { QueryPaginationInterface } from '../../interfaces/query-pagination.interface'

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name, MONGOOSE_CONNECTION_NAME)
    private readonly postsModel: Model<Posts>,
  ) {}

  create = async (payload: Posts): Promise<Posts> => {
    return this.postsModel.create(payload)
  }

  pagination = async (
    payload: QueryPaginationInterface,
  ): Promise<PaginationResponseInterface<Posts>> => {
    const { startDate = '', endDate = '', page, perPage } = payload
    const match: FilterQuery<Posts> = {}

    if (dayjs(startDate).isValid() && dayjs(endDate).isValid()) {
      match['createdAt'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    const pipeline: PipelineStage[] = [
      {
        $match: match,
      },
      {
        $facet: {
          records: [
            {
              $sort: {
                createdAt: -1,
              },
            },
            { $skip: (page - 1) * perPage },
            { $limit: perPage },
          ],
          metadata: [{ $count: 'count' }],
        },
      },
      {
        $project: {
          _id: 0,
          records: 1,
          count: { $ifNull: [{ $arrayElemAt: ['$metadata.count', 0] }, 0] },
        },
      },
    ]

    const { records, count } = await this.postsModel
      .aggregate(pipeline)
      .then((result) => result?.[0] ?? { records: [], count: 0 })

    return {
      page,
      perPage,
      count,
      records,
    }
  }

  getByObjectId = async (objectId: string): Promise<Posts> => {
    return this.postsModel.findOne({ objectId })
  }

  updatePost = async (payload: {
    post: Posts
    update: UpdatePostInterface
  }): Promise<Posts> => {
    const { post, update } = payload
    const { objectId, user } = post

    return this.postsModel.findOneAndUpdate(
      {
        objectId,
        'user.userId': user.userId,
      },
      { ...update },
      { new: true },
    )
  }

  delete = async (payload: {
    objectId: string
    userId: string
  }): Promise<Posts> => {
    const { objectId, userId } = payload
    return this.postsModel.findOneAndDelete({
      objectId,
      'user.userId': userId,
    })
  }
}
