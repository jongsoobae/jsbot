import { App } from '@slack/bolt'
import { addMessageEventHandler } from './eventHandler'

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: Number(process.env.PORT) || 3000
})

;(async () => {
  await addMessageEventHandler(app)
  await app.start()
  console.log('⚡️ Bolt app is running!')
})()
