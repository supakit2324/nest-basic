import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from './schemas/posts.schema';
import { Model } from 'mongoose';
import { MONGOOSE_CONNECTION_NAME } from '../../constants';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name, MONGOOSE_CONNECTION_NAME)
    private readonly postsModel: Model<Posts>,
  ) {}

  create = async (payload: Posts): Promise<Posts> => {
    return this.postsModel.create(payload);
  };
}
