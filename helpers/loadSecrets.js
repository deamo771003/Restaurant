require('dotenv').config()
const { getSecret } = require('./getSecretsManager')
const secretName = 'restaurant-AWS-secret'

export async function loadSecrets() {
  try {
    const secrets = await getSecret(secretName)
    process.env.RDS_USERNAME = secrets.RDS_USERNAME
    process.env.RDS_PASSWORD = secrets.RDS_PASSWORD
    process.env.RDS_DB_NAME = secrets.RDS_DB_NAME
    process.env.RDS_HOSTNAME = secrets.RDS_HOSTNAME
    process.env.RDS_DB_PORT = secrets.RDS_DB_PORT
    process.env.IMGUR_CLIENT_ID = secrets.IMGUR_CLIENT_ID
    process.env.FACEBOOK_ID = secrets.FACEBOOK_ID
    process.env.FACEBOOK_SECRET = secrets.FACEBOOK_SECRET
    process.env.FACEBOOK_CALLBACK = secrets.FACEBOOK_CALLBACK
    process.env.SESSION_SECRET = secrets.SESSION_SECRET
    process.env.REDIS_URL = secrets.REDIS_URL
  } catch (error) {
    console.error('Failed to load secrets:', error)
    process.exit(1)
  }
}