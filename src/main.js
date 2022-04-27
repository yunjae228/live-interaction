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
    ctx.websocket.on('message', (message) => {
      console.log(message.toString())
      ctx.websocket.send('hello client')
    })
  })
)

app.listen(3000)
