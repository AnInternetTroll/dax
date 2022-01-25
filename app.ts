#!/usr/bin/env -S deno run --allow-net --allow-read=. --no-check
import {
	Application,
	Router,
	send,
	Status,
} from "https://deno.land/x/oak@v10.1.0/mod.ts";

const app = new Application();
const router = new Router();

const names: string[] = JSON.parse(
	localStorage.getItem("names") || "[]",
) || [];

router.get("/names", (ctx) => {
	ctx.response.headers.set("content-type", "application/json");
	ctx.response.body = JSON.stringify(names);
});
router.post("/names", async (ctx) => {
	const bodyOak = ctx.request.body();
	if (bodyOak.type !== "json") {
		ctx.throw(Status.BadRequest, "Only JSON allowed");
	}
	const body = await bodyOak.value;

	names.push(body.name);
	localStorage.setItem("names", JSON.stringify(names));

	ctx.response.headers.set("content-type", "application/json");
	ctx.response.body = JSON.stringify(names);
});
app.use(router.allowedMethods());
app.use(router.routes());
app.use(async (ctx) => {
	await send(ctx, ctx.request.url.pathname, {
		root: `${Deno.cwd()}/static`,
		index: "index.html",
	});
});

await app.listen({ port: 8000 });
