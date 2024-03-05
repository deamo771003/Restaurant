const fs = require('fs')
const { execSync } = require('child_process')
const { getSecret } = require('../helpers/getSecretsManager')


async function createEnv() {
  const envPath = '../.env'
  if (process.env.NODE_ENV == 'production') {
    const secretName = 'restaurant-AWS-secret'
    const secrets = await getSecret(secretName)
    const envContent = `RDS_USERNAME=${secrets.RDS_USERNAME}
    RDS_PASSWORD=${secrets.RDS_PASSWORD}
    RDS_DB_NAME=${secrets.RDS_DB_NAME}
    RDS_HOSTNAME=${secrets.RDS_HOSTNAME}
    RDS_DB_PORT=${secrets.RDS_DB_PORT}
    IMGUR_CLIENT_ID=${secrets.IMGUR_CLIENT_ID}
    FACEBOOK_ID=${secrets.FACEBOOK_ID}
    FACEBOOK_SECRET=${secrets.FACEBOOK_SECRET}
    FACEBOOK_CALLBACK=${secrets.FACEBOOK_CALLBACK}
    SESSION_SECRET=${secrets.SESSION_SECRET}
    REDIS_URL=${secrets.REDIS_URL}
    `
    try {
      fs.writeFileSync(envPath, envContent)

      execSync(`chmod 600 ${envPath}`)
      console.log('Create .env  success')
    } catch (error) {
      console.error('Create .env error:', error)
    }
  }
}

module.exports = { createEnv }