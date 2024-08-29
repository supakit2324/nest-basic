import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { AppModule } from './modules/app/app.module'
import { setupSwagger } from './swagger'

dayjs.extend(utc)
dayjs.extend(timezone)

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get<ConfigService>(ConfigService)
  const port = configService.get('port')
  const logger = new Logger()

  setupSwagger(app)

  await app.listen(port, () => {
    logger.log(`
      Application nest js basic started listen on port ${port}
      Local Timezone guess: ${dayjs.tz.guess()}
      Local Date: ${dayjs().toDate().toISOString()} ~ ${dayjs().format(
        'YYYY-MM-DD HH:mm:ss',
      )}
    `)
  })
}
bootstrap()
