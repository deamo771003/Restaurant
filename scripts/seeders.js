const { exec } = require('child_process')
const { loadSecrets } = require('../helpers/loadSecrets')

async function getSecret() {
  await loadSecrets()
  exec('npx sequelize db:seed:all', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)
  })
}

(async () => {
  await getSecret()
})();