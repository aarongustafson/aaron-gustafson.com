import { createHash } from "node:crypto";
import { Parser } from "htmlparser2";

export function parseAtUri(uri) {
	const match = /^at:\/\/(did:[^/]+)\/([^/]+)\/([^/?#]+)$/.exec(uri);
	if (!match) throw new Error(`Invalid AT URI: ${uri}`);
	return { repo: match[1], collection: match[2], rkey: match[3] };
}

export function atprotoCredentials() {
	if (process.env.ATP_IDENTIFIER && process.env.ATP_APP_PASSWORD) {
		return {
			identifier: process.env.ATP_IDENTIFIER,
			password: process.env.ATP_APP_PASSWORD,
			pdsUrl: process.env.PDS_URL || "https://bsky.social",
		};
	}
	throw new Error(
		"Set ATP_IDENTIFIER and ATP_APP_PASSWORD (and optionally PDS_URL).",
	);
}

export class AtprotoClient {
	constructor({
		service = "https://bsky.social",
		fetchImpl = globalThis.fetch,
	} = {}) {
		this.service = service.replace(/\/$/, "");
		this.fetch = fetchImpl;
	}

	async request(method, { params, body } = {}) {
		const url = new URL(`/xrpc/${method}`, this.service);
		for (const [key, value] of Object.entries(params || {})) {
			url.searchParams.set(key, value);
		}
		const response = await this.fetch(url, {
			method: body === undefined ? "GET" : "POST",
			headers: {
				...(this.accessJwt
					? { Authorization: `Bearer ${this.accessJwt}` }
					: {}),
				...(body === undefined ? {} : { "Content-Type": "application/json" }),
			},
			...(body === undefined ? {} : { body: JSON.stringify(body) }),
			signal: AbortSignal.timeout(30000),
		});
		const data = await response.json();
		if (!response.ok || data.error) {
			const error = new Error(
				`${method}: ${data.message || data.error || response.status}`,
			);
			error.code = data.error;
			throw error;
		}
		return data;
	}

	async login(credentials) {
		this.service = (credentials.pdsUrl || this.service).replace(/\/$/, "");
		const session = await this.request("com.atproto.server.createSession", {
			body: {
				identifier: credentials.identifier,
				password: credentials.password,
			},
		});
		this.accessJwt = session.accessJwt;
		this.did = session.did;
		const pds = session.didDoc?.service?.find((entry) =>
			entry.id.endsWith("#atproto_pds"),
		)?.serviceEndpoint;
		if (pds) this.service = pds.replace(/\/$/, "");
		return this;
	}

	async getRecord(uri) {
		const ref = parseAtUri(uri);
		let identityUrl;
		if (ref.repo.startsWith("did:plc:")) {
			identityUrl = `https://plc.directory/${ref.repo}`;
		} else if (ref.repo.startsWith("did:web:")) {
			const [host, ...segments] = ref.repo
				.slice(8)
				.split(":")
				.map(decodeURIComponent);
			identityUrl = `https://${host}/${segments.length ? `${segments.join("/")}/` : ".well-known/"}did.json`;
		} else {
			throw new Error(`Unsupported DID method: ${ref.repo}`);
		}
		const didResponse = await this.fetch(identityUrl, {
			signal: AbortSignal.timeout(30000),
		});
		if (!didResponse.ok)
			throw new Error(`Cannot resolve ${ref.repo}: HTTP ${didResponse.status}`);
		const did = await didResponse.json();
		const service = did.service?.find((entry) =>
			entry.id.endsWith("#atproto_pds"),
		)?.serviceEndpoint;
		if (!service) throw new Error(`No PDS found for ${ref.repo}`);
		// Record discovery must not forward the publishing account's access token.
		return new AtprotoClient({ service, fetchImpl: this.fetch }).request(
			"com.atproto.repo.getRecord",
			{ params: ref },
		);
	}

	async uploadImage(url) {
		const response = await this.fetch(url, {
			signal: AbortSignal.timeout(30000),
		});
		if (!response.ok)
			throw new Error(`Cannot fetch card image: HTTP ${response.status}`);
		let type = response.headers.get("content-type")?.split(";")[0];
		if (
			![
				"image/jpeg",
				"image/png",
				"image/webp",
				"image/gif",
				"image/avif",
			].includes(type)
		) {
			throw new Error(`Unsupported Bluesky card image type: ${type}`);
		}
		let image = new Uint8Array(await response.arrayBuffer());
		if (
			image.length > 1000000 ||
			!["image/jpeg", "image/png", "image/webp"].includes(type)
		) {
			const { default: sharp } = await import("sharp");
			image = await sharp(image)
				.rotate()
				.resize({
					width: 1200,
					height: 1200,
					fit: "inside",
					withoutEnlargement: true,
				})
				.jpeg({ quality: 80, mozjpeg: true })
				.toBuffer();
			type = "image/jpeg";
		}
		if (image.length > 1000000) {
			throw new Error(
				"Bluesky card image must be JPEG, PNG, or WebP and at most 1 MB.",
			);
		}
		const upload = await this.fetch(
			`${this.service}/xrpc/com.atproto.repo.uploadBlob`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${this.accessJwt}`,
					"Content-Type": type,
				},
				body: image,
				signal: AbortSignal.timeout(30000),
			},
		);
		const data = await upload.json();
		if (!upload.ok || !data.blob)
			throw new Error(
				`Card image upload failed: ${data.message || upload.status}`,
			);
		return data.blob;
	}
}

export function parseLinkMetadata(html, url) {
	const meta = {};
	const links = {};
	const parser = new Parser({
		onopentag(name, attributes) {
			if (name === "meta") {
				const key = attributes.property || attributes.name;
				if (key && !(key in meta)) meta[key] = attributes.content;
			}
			if (name === "link" && attributes.rel?.startsWith("site.standard.")) {
				links[attributes.rel] = attributes.href;
			}
		},
	});
	parser.end(html);
	return {
		url,
		title: meta["og:title"] || meta["twitter:title"] || "",
		description:
			meta["og:description"] ||
			meta["twitter:description"] ||
			meta.description ||
			"",
		image:
			meta["og:image"] || meta["twitter:image"]
				? new URL(meta["og:image"] || meta["twitter:image"], url).href
				: undefined,
		documentUri: links["site.standard.document"],
		publicationUri: links["site.standard.publication"],
	};
}

export async function fetchLinkMetadata(url, fetchImpl = globalThis.fetch) {
	if (!["https:", "http:"].includes(new URL(url).protocol))
		throw new Error(`Invalid link URL: ${url}`);
	const response = await fetchImpl(url, {
		headers: { Accept: "text/html" },
		signal: AbortSignal.timeout(30000),
	});
	if (!response.ok)
		throw new Error(
			`Cannot fetch link metadata for ${url}: HTTP ${response.status}`,
		);
	return parseLinkMetadata(await response.text(), response.url || url);
}

export async function buildBlueskyEmbed(client, metadata) {
	const external = {
		uri: metadata.url,
		title: metadata.title,
		description: metadata.description,
	};
	const refs = [];
	if (metadata.documentUri) {
		const document = await client.getRecord(metadata.documentUri);
		const publicationUri = document.value.site;
		const publication = publicationUri.startsWith("at://")
			? await client.getRecord(publicationUri)
			: undefined;
		const siteUrl = publication ? publication.value.url : publicationUri;
		const documentUrl = `${siteUrl.replace(/\/$/, "")}${document.value.path || ""}`;
		if (documentUrl !== metadata.url) {
			throw new Error(
				`standard.site document URL does not match shared URL: ${documentUrl}`,
			);
		}
		refs.push({ uri: document.uri, cid: document.cid });
		if (publication) refs.push({ uri: publication.uri, cid: publication.cid });
		if (
			client.did === parseAtUri(document.uri).repo &&
			document.value.coverImage
		) {
			external.thumb = document.value.coverImage;
		}
	} else if (metadata.publicationUri) {
		const publication = await client.getRecord(metadata.publicationUri);
		refs.push({ uri: publication.uri, cid: publication.cid });
	}
	if (refs.length) external.associatedRefs = refs;
	if (metadata.image && !external.thumb)
		external.thumb = await client.uploadImage(metadata.image);
	return { $type: "app.bsky.embed.external", external };
}

export function blueskyLinkFacet(text, url) {
	const start = text.lastIndexOf(url);
	if (start < 0)
		throw new Error("Bluesky post text must contain the complete shared URL.");
	return {
		index: {
			byteStart: Buffer.byteLength(text.slice(0, start)),
			byteEnd: Buffer.byteLength(text.slice(0, start + url.length)),
		},
		features: [{ $type: "app.bsky.richtext.facet#link", uri: url }],
	};
}

export function blueskyPostKey(id, publishedAt) {
	const milliseconds = Date.parse(publishedAt);
	if (!Number.isFinite(milliseconds) || milliseconds < 0)
		throw new Error(
			"A valid source publication date is required for Bluesky posting.",
		);
	const hash = createHash("sha256").update(id).digest();
	// A stable, valid TID allows retries without creating duplicate social posts.
	let value =
		((BigInt(milliseconds) * 1000n + BigInt(hash.readUInt16BE(0) % 1000)) <<
			10n) |
		BigInt(hash.readUInt16BE(2) % 1024);
	const alphabet = "234567abcdefghijklmnopqrstuvwxyz";
	let key = "";
	for (let index = 0; index < 13; index++) {
		key = alphabet[Number(value & 31n)] + key;
		value >>= 5n;
	}
	return key;
}
