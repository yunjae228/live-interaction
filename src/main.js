// @ts-check

const Koa = require('koa')

const Pug = require('koa-pug')
const path = require('path')
const route = require('koa-route')
const websockify = require('koa-websocket')
const app = websockify(new Koa())
const mongoClient = require('./mongo')

const serve = require('koa-static')
const mount = require('koa-mount')

//@ts-ignore
new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
})

app.use(mount('/public', serve('src/public')))

app.use(async (ctx) => {
  await ctx.render('main')
})

// mongodb 연결은 단 한번만 해도되니 따로 _client변수로 선언해서 사용하도록 하자
const _client = mongoClient.connect()

// mongodb client 연결 변수를 토대로 collection과 db 생성 (chat db)
async function getChatsCollection() {
  const client = await _client
  return client.db('chat').collection('chats')
}

// Using routes
app.ws.use(
  route.all('/ws', async (ctx) => {
    const chatsCollection = await getChatsCollection()
    const chatCursor = chatsCollection.find(
      {},
      {
        sort: {
          createdAt: 1,
        },
      }
    )

    const chats = await chatCursor.toArray()
    ctx.websocket.send(
      JSON.stringify({
        type: 'sync',
        payload: {
          chats,
        },
      })
    )

    ctx.websocket.on('message', async (data) => {
      /**
       * @type {Chat}
       */
      // @ts-ignore
      const chat = JSON.parse(data)

      //
      await chatsCollection.insertOne({
        ...chat,
        createdAt: new Date(),
      })
      const { message, nickname } = chat

      const { server } = app.ws

      if (!server) {
        return
      }

      // localhost:3000/ws 에 연결된 모든 클라이언트들에게 브로드캐스트 forEach
      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'chat',
            payload: {
              message,
              nickname,
            },
          })
        )
      })
    })
  })
)

app.listen(3000)
