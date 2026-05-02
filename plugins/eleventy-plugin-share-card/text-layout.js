/**
 * Text layout utilities for the share-card generator.
 *
 * These utilities handle:
 *   - Character-level width estimation for proportional fonts
 *   - Word-wrapping text into lines that fit a given pixel width
 *   - Building SVG <text> elements with correct multi-line positioning
 *   - XML-escaping text content
 *
 * Note: width estimation is intentionally heuristic — it produces good
 * results for Latin text without requiring actual font shaping. Users can
 * tune `charWidthRatio` in each layer config if a specific font renders
 * wider or narrower than the default.
 */

/**
 * Estimate the rendered pixel width of a single character.
 *
 * The estimates are based on common proportional font metrics for Latin text.
 * They work well for most display-weight serif and sans-serif faces.
 *
 * @param {string} char - a single character
 * @param {number} fontSize - font size in pixels
 * @returns {number} estimated width in pixels
 */
export function estimateCharWidth(char, fontSize) {
	if (/[il1|!;:.,'"()\[\]{}\/\\]/.test(char)) return fontSize * 0.28; // narrow
	if (/[mMwW]/.test(char)) return fontSize * 0.75; // wide
	if (/[A-Z]/.test(char)) return fontSize * 0.65; // uppercase
	if (/[0-9]/.test(char)) return fontSize * 0.58; // digits
	if (char === " ") return fontSize * 0.28; // space
	return fontSize * 0.52; // average lowercase
}

/**
 * Estimate the total pixel width of a string.
 *
 * @param {string} text
 * @param {number} fontSize - font size in pixels
 * @returns {number} estimated pixel width
 */
export function estimateTextWidth(text, fontSize) {
	return Array.from(text).reduce(
		(sum, ch) => sum + estimateCharWidth(ch, fontSize),
		0,
	);
}

/**
 * Wrap text into lines whose estimated pixel width does not exceed maxWidth.
 *
 * Words that are individually longer than maxWidth are hard-broken at the
 * boundary so the output always fits.
 *
 * @param {string} text - the raw text to wrap
 * @param {number} maxWidth - maximum line width in pixels
 * @param {number} fontSize - font size in pixels
 * @param {number} [charWidthRatio=1] - multiplier applied to all width estimates;
 *   increase above 1.0 for fonts that render wider than the default heuristic
 *   (e.g. 1.1 for Open Sans, 1.15 for wider display faces)
 * @returns {string[]} array of lines (never empty — returns [''] for empty input)
 */
export function wrapText(text, maxWidth, fontSize, charWidthRatio = 1) {
	if (!text) return [""];

	// Scaled width helpers — apply charWidthRatio consistently
	const scaledTextWidth = (str) => estimateTextWidth(str, fontSize) * charWidthRatio;
	const scaledSpaceWidth = estimateCharWidth(" ", fontSize) * charWidthRatio;

	const words = text.split(/\s+/).filter(Boolean);
	const lines = [];
	let currentLine = "";
	let currentWidth = 0;

	for (const word of words) {
		const wordWidth = scaledTextWidth(word);
		const spaceWidth = currentLine ? scaledSpaceWidth : 0;

		if (currentLine && currentWidth + spaceWidth + wordWidth > maxWidth) {
			// Current line is full — flush it
			lines.push(currentLine);

			if (wordWidth > maxWidth) {
				// Hard-break words wider than the whole area
				let remaining = word;
				while (scaledTextWidth(remaining) > maxWidth) {
					// Binary-search the break point
					let lo = 1;
					let hi = remaining.length;
					while (lo < hi) {
						const mid = Math.ceil((lo + hi) / 2);
						if (scaledTextWidth(remaining.slice(0, mid)) <= maxWidth) {
							lo = mid;
						} else {
							hi = mid - 1;
						}
					}
					lines.push(remaining.slice(0, lo));
					remaining = remaining.slice(lo);
				}
				currentLine = remaining;
				currentWidth = scaledTextWidth(remaining);
			} else {
				currentLine = word;
				currentWidth = wordWidth;
			}
		} else {
			currentLine = currentLine ? `${currentLine} ${word}` : word;
			currentWidth += spaceWidth + wordWidth;
		}
	}

	if (currentLine) lines.push(currentLine);
	return lines.length ? lines : [""];
}

/**
 * Escape a string for safe inclusion in SVG/XML.
 *
 * @param {string} str
 * @returns {string}
 */
export function escapeXml(str) {
	return String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

/**
 * Build the SVG <text> elements for one text layer.
 *
 * Supports two gravity modes:
 *   - `{ from: 'bottom', value: N }` (Cloudinary "south" gravity):
 *       the BOTTOM of the text block sits N pixels above the image bottom.
 *   - `{ from: 'top', value: N }` or a plain number N (Cloudinary "north" gravity):
 *       the TOP of the text block starts N pixels from the image top.
 *
 * @param {object} layer - layer configuration (see generator.js for full shape)
 * @param {string} text  - resolved text to render
 * @param {number} imageHeight - total image height in pixels (needed for south gravity)
 * @returns {string} SVG markup for this layer's text elements
 */
export function buildTextElements(layer, text, imageHeight) {
	const {
		x = 0,
		y,
		fontSize,
		font = "serif",
		fontFallback = "serif",
		fontWeight = 400,
		color = "#000000",
		maxWidth,
		lineSpacing = 0,
		charWidthRatio = 1,
	} = layer;

	// Line height: natural 1.2× leading adjusted by lineSpacing
	const lineHeight = fontSize * 1.2 + lineSpacing;
	const lines = wrapText(text, maxWidth, fontSize, charWidthRatio);

	// Normalise color — accept "RRGGBB" or "#RRGGBB"
	const fill = color.startsWith("#") ? color : `#${color}`;

	const elements = [];

	if (typeof y === "object" && y.from === "bottom") {
		// South gravity: the last line's baseline is at (imageHeight - y.value)
		const lastBaseline = imageHeight - y.value;
		for (let i = lines.length - 1; i >= 0; i--) {
			const offset = lines.length - 1 - i; // 0 for last line, 1 for second-to-last …
			const baseline = lastBaseline - offset * lineHeight;
		elements.unshift(buildTextEl(lines[i], x, baseline, font, fontFallback, fontWeight, fontSize, fill));
		}
	} else {
		// North gravity (default): the first line's baseline is at (y + fontSize)
		const yValue = typeof y === "object" ? y.value : (y ?? 0);
		const firstBaseline = yValue + fontSize;
		for (let i = 0; i < lines.length; i++) {
			const baseline = firstBaseline + i * lineHeight;
			elements.push(buildTextEl(lines[i], x, baseline, font, fontFallback, fontWeight, fontSize, fill));
		}
	}

	return elements.join("\n");
}

function buildTextEl(text, x, y, font, fontFallback, weight, size, fill) {
	return `\t<text x="${x}" y="${y.toFixed(2)}" font-family="${escapeXml(font)}, ${escapeXml(fontFallback)}" font-weight="${weight}" font-size="${size}" fill="${fill}">${escapeXml(text)}</text>`;
}
