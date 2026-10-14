import { resolveMetadata } from "../_11ty/metadata.js";

export default {
	eleventyComputed: {
		metadata: (data) => resolveMetadata(data),
	},
};
