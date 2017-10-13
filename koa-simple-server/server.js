const Koa = require('koa');
const _ = require('koa-route');

const app = new Koa();

const test = {
  test: (ctx) => {
    // response
    ctx.body = 'Hello Koa';
  },

  testRoute: async (ctx, message, next) => {
    await next();
    ctx.response.body = `I like ${message}`;
  },

}

app.use(_.get('/', test.test));
app.use(_.get('/test/:message', test.testRoute));




console.log("Starting server at localhost:3001 . . . \n \n");
app.listen(3001);
console.log("server running");
