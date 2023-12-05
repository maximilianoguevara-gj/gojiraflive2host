const fs = require('fs')

fs.writeFileSync(
  `${__dirname}/getEnvs.js`,
  `const process = {
  env: {
    FB_API_KEY: '${process.env.REACT_APP_API_KEY}',
    FB_AUTH_DOMAIN: '${process.env.REACT_APP_AUTH_DOMAIN}',
    FB_PROJECT_ID: '${process.env.REACT_APP_PROJECT_ID}',
    FB_MESSAGING_SENDER_ID: '${process.env.REACT_APP_MESSAGING_SENDER_ID}',
    FB_APP_ID: '${process.env.REACT_APP_APP_ID}',
  }
}
`,
)
