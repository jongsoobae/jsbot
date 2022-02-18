import pkg from '@slack/bolt'
const { App } = pkg
const userToken = process.env.SLACK_USER_TOKEN

const isRemovable = (botId, attachments) => {
  if (botId !== 'B033JFZE4Q2') return false
  const attachment = attachments[0]
  const pretext = attachment.pretext
  const title = attachment.title

  if (pretext.includes('dependabot[bot]')) return true
  if (!pretext.includes('Pull request opened by')) return true
  return title.includes('D2S') || title.includes('S2M')
}

const deleteSlackMessage = async (client, channel, ts) => {
  try {
    await client.chat.delete({
      channel: channel,
      ts: ts,
      token: userToken
    })
  } catch (e) {}
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
})

app.event('message', async ({ event, client, message, logger }) => {
  const { ts, attachments, channel, bot_id: botId } = message
  logger.info('----------------------------------------')
  logger.info(`${channel}, ${ts}`)

  if (channel !== 'C033X1649LH') return
  let isDel = false
  try {
    isDel = isRemovable(botId, attachments)
  } catch (e) {}

  logger.info(`isDel: ${isDel}`)

  if (isDel) {
    await deleteSlackMessage(client, channel, ts)
    console.log(attachments)
  }
})
;(async () => {
  await app.start()
  console.log('⚡️ Bolt app is running!')
})()
