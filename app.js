import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";

const app = new Application();
const router = new Router();

let visitsCount = 0;
const countVisitsMiddleware = async (context, next) => {
    if (context.request.url.pathname === "/visits") {
        visitsCount++;
    }
    console.log(visitsCount);
    await next();
};

const notFoundMiddleware = async (context, next) => {
    await next();
    if (context.response.status === 404) {
        context.response.status = 200;
        await context.render("index.eta");
    }
};

app.use(renderMiddleware);
app.use(countVisitsMiddleware);

router.get("/", ({ render }) => render("index.eta"));
router.get("/visits", ({ render }) => render("visits.eta", { visitsCount }));
router.get("/meaning", (context) => {
    context.response.body =
        "Seeking truths beyond meaning of life, you will find 43.";
});
app.use(router.routes());
app.use(notFoundMiddleware);

if (!Deno.env.get("TEST_ENVIRONMENT")) {
    app.listen({ port: 7777 });
}

export default app;
