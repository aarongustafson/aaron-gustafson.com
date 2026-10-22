import fs from "node:fs";

export default function () {
	return JSON.parse(
		fs.readFileSync(new URL("../../sequoia.json", import.meta.url), "utf8"),
	);
}
