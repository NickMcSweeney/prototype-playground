const Koa = require('koa');
const app = new Koa();

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});



console.log("Starting server at localhost:3001 . . . \n \n");
app.listen(3001);
console.log("server running");
