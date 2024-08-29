import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CommentsService } from './comments.service'

import { MONGOOSE_CONNECTION_NAME } from '../../constants'
import { mongooseModels } from '../../mongoose/mongoose.providers'

const service = [CommentsService]
const useCase = []

@Module({
  imports: [
    MongooseModule.forFeature(mongooseModels, MONGOOSE_CONNECTION_NAME),
  ],
  controllers: [],
  providers: [...service, ...useCase],
  exports: [...service, ...useCase],
})
export class CommentsModule {}
