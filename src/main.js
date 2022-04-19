// @ts-check

const Koa = require('koa')
const app = new Koa()
const Pug = require('koa-pug')
const path = require('path')

//@ts-ignore
new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
})

app.use(async (ctx) => {
  await ctx.render('main')
})

app.listen(3000)
