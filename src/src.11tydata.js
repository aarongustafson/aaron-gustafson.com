import { createHash } from "node:crypto";
import { resolveMetadata } from "../_11ty/metadata.js";

export default {
	eleventyComputed: {
		metadata: async function (data) {
			const metadata = resolveMetadata(data);
			const url = data.page?.url;
			if (
				data.social_image ||
				data.image ||
				data.og_image ||
				!url ||
				!/\/$|\.html$/i.test(url)
			) {
				return metadata;
			}

			// Full URLs distinguish paginated pages and names shared across sections.
			const hash = createHash("sha256").update(url).digest("hex").slice(0, 16);
			const image = await this.generateShareCard(
				[metadata.socialTitle],
				`page-${hash}`,
			);
			return resolveMetadata(data, { fallbackImage: image });
		},
	},
};
