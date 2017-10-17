const Koa = require("koa");
const Router = require("koa-router");
const translate = require("google-translate-api");
const cors = require('koa-cors');
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const test = new Router();

let data = "poodles of rain";

const strings = {
  BaBaBlackSheep:
    "Schaapje, schaapje, heb je witte wol? \nJa baas, ja baas, drie zakken vol \nEén voor de meester en één voor z'n vrouw \nEén voor het kindje dat bibbert van de kou \nSchaapje, schaapje, heb je witte wol? \nJa baas, ja baas, drie zakken vol.",
  PoesjeMauw:
    "Poesje Mauw \nKom eens gauw \nIk heb lekkere melk voor jou \nEn voor mij \nRijstebrij \nO wat heerlijk smullen wij!",
};

const myTestRoutes = {
  hello: ctx => {
    ctx.body = "Hello World";
  },

  testRoute: async (ctx, next) => {
    await next();
    ctx.response.body = `I like ${ctx.params.message}`;
  },

  translateStr: async (ctx, next) => {
    try {
      console.log(ctx.request.body);
      let res = await translate(strings[ctx.params.str], {
        from: "nl",
        to: "en",
      });
      console.log("Success", res.text);
      ctx.response.body = `NL: ${strings[
        ctx.params.str
      ]}\n -- TO -- \nEN: ${res.text}`;
    } catch (e) {
      console.error(e);
    } finally {
    }
  },

  inputTest: async (ctx, next) => {
    try {
      console.log("Testing input", ctx.request);
      await next();
      ctx.body = ctx.request.body;
      console.log("Your request is", ctx.body, ctx.request.body);

      // ctx.response.body = "Sucess - ish";
      ctx.response.status = 200;
      ctx.response.type = "application/json";
      ctx.response.body = {text: `I hate ${ctx.body.text}`};
      console.log("Finished input test", ctx.response);
      return ctx.response;
    } catch (e) {}
  },

  inputTranslate: async (ctx, next) => {
    try {
      console.log("Testing input", ctx.request);
      ctx.body = ctx.request.body;
      let res = await translate(ctx.body.text, {
        from: ctx.body.langOrigin,
        to: ctx.body.langOut,
      });

      // ctx.response.body = "Sucess - ish";
      ctx.response.status = 200;
      ctx.response.type = "application/json";
      ctx.response.body = res;
      console.log("Finished input test", ctx.response);
      return ctx.response;
    } catch (e) {}
  },
};

console.log("Starting server at localhost:3001 . . . \n");

test.get("/test/:message", myTestRoutes.testRoute);
test.get("/translate/:str", myTestRoutes.translateStr);
test.get("/test/", myTestRoutes.hello);
test.post("/input/", myTestRoutes.inputTest);
test.post("/input/translate/", myTestRoutes.inputTranslate);

app.use(cors());
app.use(bodyParser());
app.use(test.routes());

app.listen(3001);
console.log("server running");
