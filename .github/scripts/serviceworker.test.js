import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import {
	getAssetVersion,
	getPreinstallAssets,
} from "../../_tasks/serviceworker.js";

const source = (file) =>
	fs.readFileSync(
		new URL(`../../src/_javascript/serviceworker/${file}.js`, import.meta.url),
		"utf8",
	);

function worker() {
	const listeners = {};
	const stores = new Map();
	const requests = [];
	let network = async () => new Response("fresh");
	const key = (request) =>
		new URL(
			typeof request === "string" ? request : request.url,
			"https://www.aaron-gustafson.com",
		).href;
	const caches = {
		async open(name) {
			if (!stores.has(name)) stores.set(name, new Map());
			const store = stores.get(name);
			return {
				async match(request) {
					return store.get(key(request))?.clone();
				},
				async put(request, response) {
					store.set(key(request), response.clone());
				},
				async addAll(assets) {
					const responses = await Promise.all(
						assets.map(async (request) => {
							const response = await context.fetch(request);
							if (!response.ok) throw new Error("Precache failed");
							return response;
						}),
					);
					await Promise.all(
						assets.map((request, i) => this.put(request, responses[i])),
					);
				},
			};
		},
		async match(request) {
			for (const name of stores.keys()) {
				const response = await (await this.open(name)).match(request);
				if (response) return response;
			}
		},
		async keys() {
			return [...stores.keys()];
		},
		async delete(name) {
			return stores.delete(name);
		},
	};
	const context = vm.createContext({
		URL,
		Response,
		Request: class extends Request {
			constructor(input, options) {
				super(key(input), options);
			}
		},
		navigator: {},
		console,
		caches,
		clients: { async claim() {} },
		self: {
			addEventListener(name, callback) {
				listeners[name] = callback;
			},
		},
		async fetch(request, options) {
			requests.push({ request, options });
			return network(request, options);
		},
	});
	const header = source("_header")
		.replace("{{ VERSION }}", "test")
		.replace(
			'"{{ ASSETS }}"',
			JSON.stringify([
				"/c/advanced.min.css",
				"/j/main.min.js",
				"/j/theme/init.js",
				"/j/theme-switcher/define.js",
				"/j/form-multi-switch/index.js",
			]),
		);
	vm.runInContext(
		[
			header,
			source("utils"),
			source("install"),
			source("activate"),
			source("fetch"),
		].join("\n"),
		context,
	);
	async function dispatch(name, request) {
		const pending = [];
		let response;
		listeners[name]({
			request,
			waitUntil(promise) {
				assert.equal(
					typeof promise?.then,
					"function",
					"waitUntil needs a promise",
				);
				pending.push(promise);
			},
			respondWith(promise) {
				response = promise;
			},
		});
		const result = await response;
		await Promise.all(pending);
		return result;
	}
	return {
		caches,
		requests,
		dispatch,
		setNetwork(callback) {
			network = callback;
		},
		request(url, accept = "*/*") {
			return new Request(`https://www.aaron-gustafson.com${url}`, {
				headers: { Accept: accept },
			});
		},
	};
}

test("asset version is stable across content-only builds and checkout paths", (t) => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "sw-assets-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));
	const worker = path.join(root, "worker");
	const assets = path.join(root, "static");
	for (const directory of [worker, `${assets}/c`, `${assets}/j/theme`]) {
		fs.mkdirSync(directory, { recursive: true });
	}
	fs.writeFileSync(`${worker}/install.js`, "install");
	fs.writeFileSync(`${assets}/c/advanced.min.css`, "css");
	fs.writeFileSync(`${assets}/j/theme/init.js`, "js");
	const version = () => getAssetVersion({ worker, assets });
	const original = version();
	fs.writeFileSync(`${assets}/index.html`, "new post");
	fs.writeFileSync(`${assets}/j/theme/init.js.map`, "map");
	fs.utimesSync(`${assets}/j/theme/init.js`, new Date(0), new Date(0));
	assert.equal(version(), original);
	const copy = `${root}/copy`;
	fs.cpSync(assets, copy, { recursive: true });
	assert.equal(getAssetVersion({ worker, assets: copy }), original);
	assert.deepEqual(getPreinstallAssets(assets), [
		"/c/advanced.min.css",
		"/j/theme/init.js",
	]);
	for (const file of [
		`${assets}/c/advanced.min.css`,
		`${assets}/j/theme/init.js`,
		`${worker}/install.js`,
	]) {
		const before = version();
		fs.appendFileSync(file, " changed");
		assert.notEqual(version(), before);
	}
});

test("install bypasses HTTP cache for all assets and rejects incomplete updates", async () => {
	const sw = worker();
	await sw.dispatch("install");
	assert.ok(
		sw.requests.some(({ request }) => request.url.endsWith("/j/theme/init.js")),
	);
	assert.ok(
		sw.requests.some(({ request }) =>
			request.url.endsWith("/j/form-multi-switch/index.js"),
		),
	);
	assert.ok(sw.requests.every(({ request }) => request.cache === "reload"));
	sw.setNetwork(async () => new Response("missing", { status: 404 }));
	await assert.rejects(sw.dispatch("install"), /Precache failed/);
});

for (const asset of [
	"/c/advanced.min.css",
	"/j/main.min.js",
	"/j/theme/init.js",
]) {
	test(`refresh serves installed ${asset}, not a legacy or HTTP-cached copy`, async () => {
		const sw = worker();
		const request = sw.request(asset);
		await (
			await sw.caches.open("v5:static")
		).put(request, new Response("legacy"));
		await sw.dispatch("install");
		await sw.dispatch("activate");
		assert.deepEqual(await sw.caches.keys(), ["vtest:static"]);
		sw.requests.length = 0;
		sw.setNetwork(async () => new Response("next deployment"));
		assert.equal(await (await sw.dispatch("fetch", request)).text(), "fresh");
		assert.equal(
			sw.requests.length,
			0,
			"installed assets must not update behind the banner",
		);
	});
}

test("asset cache misses ignore legacy caches and bypass the HTTP cache", async () => {
	const sw = worker();
	const request = sw.request("/j/extra.js?test=1");
	await (
		await sw.caches.open("v5:static")
	).put(request, new Response("legacy"));
	assert.equal(await (await sw.dispatch("fetch", request)).text(), "fresh");
	assert.equal(sw.requests[0].options.cache, "reload");
	assert.equal(
		await (await (await sw.caches.open("vtest:static")).match(request)).text(),
		"fresh",
	);
});

for (const [url, cacheName] of [
	["/", "pages"],
	["/notebook/example/", "posts"],
]) {
	test(`${cacheName} refresh silently in the background for the next load`, async () => {
		const sw = worker();
		const request = sw.request(url, "text/html");
		const cache = await sw.caches.open(`vtest:${cacheName}`);
		await cache.put(request, new Response("old HTML"));
		assert.equal(
			await (await sw.dispatch("fetch", request)).text(),
			"old HTML",
		);
		assert.equal(await (await cache.match(request)).text(), "fresh");
		assert.equal(sw.requests[0].options.cache, "no-cache");
		assert.equal(await (await sw.dispatch("fetch", request)).text(), "fresh");
		for (const fail of [
			async () => {
				throw new Error("offline");
			},
			async () => new Response("error", { status: 503 }),
		]) {
			sw.setNetwork(fail);
			assert.equal(await (await sw.dispatch("fetch", request)).text(), "fresh");
			assert.equal(await (await cache.match(request)).text(), "fresh");
		}
	});
}

test("uncached pages fall back to the installed offline page", async () => {
	const sw = worker();
	await sw.dispatch("install");
	sw.setNetwork(async () => {
		throw new Error("offline");
	});
	assert.equal(
		await (
			await sw.dispatch("fetch", sw.request("/missing/", "text/html"))
		).text(),
		"fresh",
	);
});
