export default (): any => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  authentication: {
    secret: process.env.SECRET_KEY || 'super_secret',
    hashSize: 10,
    jwtOptions: {
      header: {
        typ: 'access',
      },
      audience: 'http://localhost',
      algorithm: 'HS256',
      expiresIn: '7d',
    },
  },
  database: {
    host: process.env.MONGODB_URI,
    options: {
      dbName: process.env.DB_NAME || 'nest-js-basic',
      w: 'majority',
    },
  },
})
