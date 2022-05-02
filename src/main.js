// @ts-check

const Koa = require('koa')

const Pug = require('koa-pug')
const path = require('path')
const route = require('koa-route')
const websockify = require('koa-websocket')
const app = websockify(new Koa())

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

// Using routes
app.ws.use(
  route.all('/ws', (ctx) => {
    ctx.websocket.on('message', (data) => {
      // @ts-ignore
      const { message, nickname } = JSON.parse(data)

      const { server } = app.ws

      if (!server) {
        return
      }

      // localhost:3000/ws 에 연결된 모든 클라이언트들에게 브로드캐스트 forEach
      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            message,
            nickname,
          })
        )
      })
    })
  })
)

app.listen(3000)
