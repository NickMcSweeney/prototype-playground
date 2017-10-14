const Koa = require("koa");
const Router = require("koa-router");
const IO = require("koa-socket");
const translate = require("google-translate-api");

const app = new Koa();
const test = new Router();
const io = new IO();

let data = "poodles of rain";

const strings = {
  BaBaBlackSheep: "Schaapje, schaapje, heb je witte wol? \nJa baas, ja baas, drie zakken vol \nEén voor de meester en één voor z'n vrouw \nEén voor het kindje dat bibbert van de kou \nSchaapje, schaapje, heb je witte wol? \nJa baas, ja baas, drie zakken vol.",
  PoesjeMauw: "Poesje Mauw \nKom eens gauw \nIk heb lekkere melk voor jou \nEn voor mij \nRijstebrij \nO wat heerlijk smullen wij!"
}

const myTestRoutes = {
  hello: ctx => {
    ctx.body = "Hello Koa";
  },

  testRoute: async (ctx, next) => {
    await next();
    ctx.response.body = `I like ${ctx.params.message}`;
  },

  translateStr: async (ctx, next) => {
    try {
      let res = await translate(
        strings[ctx.params.str],
        { from: "nl", to: "en" }
       )
      console.log("Success", res.text);
      ctx.response.body = res.text;
    } catch (e) {
      console.error(e);
    } finally {

    }
  },

  inputTest: async (ctx, next) => {
    await next();
    ctx.response.body = `I hate ${data}`;
  },
};

console.log("Starting server at localhost:3001 . . . \n");

test.get("/test/:message", myTestRoutes.testRoute);
test.get("/translate/:str", myTestRoutes.translateStr);
test.get("/test/", myTestRoutes.hello);
test.get("/input/", myTestRoutes.inputTest);

io.attach(app);

app.use(test.routes());

// app.io.on('/input/', async (ctx, next) => {
//   data = "rain poodles"
//   await next();
//   console.log(data, 'are wet');
// });

app.listen(3001);
app.server.listen(process.env.PORT || 3001);
console.log("server running");
