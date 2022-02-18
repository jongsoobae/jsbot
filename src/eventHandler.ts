import { App } from '@slack/bolt'
import { WebClient } from '@slack/web-api'

const isRemovable = (botId: string, attachments: Array<any>) => {
  if (botId !== 'B033JFZE4Q2') return false
  const attachment = attachments[0]
  const pretext = attachment.pretext
  const title = attachment.title

  if (pretext.includes('dependabot[bot]')) return true
  if (!pretext.includes('Pull request opened by')) return true
  return title.includes('D2S') || title.includes('S2M')
}

const deleteSlackMessage = async (
  client: WebClient,
  channel: any,
  ts: any,
  userToken: string
) => {
  try {
    await client.chat.delete({
      channel: channel,
      ts: ts,
      token: userToken
    })
  } catch (e) {}
}

export const addMessageEventHandler = async (app: App) => {
  app.event('message', async ({ event, client, message, logger }) => {
    // @ts-ignore
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
      await deleteSlackMessage(
        client,
        channel,
        ts,
        String(process.env.SLACK_USER_TOKEN)
      )
      console.log(attachments)
    }
  })
}
