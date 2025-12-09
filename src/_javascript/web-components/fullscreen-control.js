/**
 * FullscreenControlElement - A web component to progressively enhance any video or iframe element to have fullscreen capabilities.
 *
 * @element fullscreen-control
 *
 * @attr {string} button-text - The visible text for the fullscreen button (default: "View fullscreen"). Use {name} to inject the accessible name of the video/iframe.
 * @attr {string} button-label - Optional aria-label for the fullscreen button. Use {name} to inject the accessible name of the video/iframe. If not set, uses button-text.
 *
 * @fires fullscreen-control:enter - Fired when entering fullscreen mode
 * @fires fullscreen-control:exit - Fired when exiting fullscreen mode
 *
 * @slot - Default slot for video or iframe content
 *
 * @cssprop --fullscreen-control-button-inset-block-start - Block-start position of the button (default: 0.5rem)
 * @cssprop --fullscreen-control-button-inset-inline-end - Inline-end position of the button (default: 0.5rem)
 */
class FullscreenControlElement extends HTMLElement {
	static get observedAttributes() {
		return ["button-text", "button-label"];
	}

	static _injectStyles() {
		// Check if styles are already injected
		const styleId = "fullscreen-control-styles";
		if (document.getElementById(styleId)) {
			return;
		}

		const style = document.createElement("style");
		style.id = styleId;
		style.textContent = `
			fullscreen-control {
				position: relative;
				display: inline-block;
			}

			fullscreen-control button {
				position: absolute;
				inset-block-start: var(--fullscreen-control-button-inset-block-start, 0.5rem);
				inset-inline-end: var(--fullscreen-control-button-inset-inline-end, 0.5rem);
				cursor: pointer;
				z-index: 1;
			}
		`;

		document.head.appendChild(style);
	}

	constructor() {
		super();
		this._button = null;
		this._container = null;
		this._target = null;
		this._targetId = null;
		this._shouldReturnFocus = false;
		this._handleEscape = this._handleEscape.bind(this);
		this._handleFullscreenChange = this._handleFullscreenChange.bind(this);
	}

	connectedCallback() {
		this._setup();
	}

	disconnectedCallback() {
		this._cleanup();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (
			(name === "button-text" || name === "button-label") &&
			oldValue !== newValue &&
			this._button
		) {
			this._updateButtonText();
		}
	}

	get buttonText() {
		return this.getAttribute("button-text") || "View fullscreen";
	}

	set buttonText(value) {
		this.setAttribute("button-text", value);
	}

	get buttonLabel() {
		return this.getAttribute("button-label") || "";
	}

	set buttonLabel(value) {
		this.setAttribute("button-label", value);
	}

	_getTargetName() {
		if (!this._target) {
			return "";
		}

		// Try aria-label first, then title, then empty string
		return (
			this._target.getAttribute("aria-label") ||
			this._target.getAttribute("title") ||
			""
		);
	}

	_replaceNameToken(text) {
		const name = this._getTargetName();
		return text.replace(/\{name\}/g, name);
	}

	_updateButtonText() {
		if (!this._button) {
			return;
		}

		const visibleText = this._replaceNameToken(this.buttonText);
		this._button.textContent = visibleText;

		const hasCustomLabel = this.hasAttribute("button-label");
		const resolvedLabel = hasCustomLabel
			? this._replaceNameToken(this.buttonLabel)
			: "";

		if (hasCustomLabel && resolvedLabel && resolvedLabel !== visibleText) {
			this._button.setAttribute("aria-label", resolvedLabel);
		} else {
			this._button.removeAttribute("aria-label");
		}
	}

	_setup() {
		// Find the video or iframe element
		this._target = this.querySelector("video, iframe");

		if (!this._target) {
			console.warn("fullscreen-control: No video or iframe element found");
			return;
		}

		this._targetId = this._ensureTargetId();

		// Enhance the target to allow fullscreen
		this._enhanceTarget();

		// Inject styles
		FullscreenControlElement._injectStyles();

		// Create and insert the fullscreen button
		this._createButton();

		// Listen for fullscreen changes
		document.addEventListener("fullscreenchange", this._handleFullscreenChange);
	}

	_cleanup() {
		if (this._button) {
			this._button.removeEventListener("click", this._handleButtonClick);
		}
		document.removeEventListener("keydown", this._handleEscape);
		document.removeEventListener(
			"fullscreenchange",
			this._handleFullscreenChange,
		);
	}

	_enhanceTarget() {
		// Add allowfullscreen attribute to iframes
		if (this._target.tagName.toLowerCase() === "iframe") {
			// Modern syntax
			this._target.setAttribute("allow", "fullscreen");
			// Legacy attributes for broader compatibility
			this._target.setAttribute("allowfullscreen", "");
			this._target.setAttribute("webkitallowfullscreen", "");
			this._target.setAttribute("mozallowfullscreen", "");
		}

		// Ensure the target has controls if it's a video
		if (this._target.tagName.toLowerCase() === "video") {
			this._target.setAttribute("controls", "");
		}
	}

	_createButton() {
		this._button = document.createElement("button");
		this._button.setAttribute("type", "button");
		if (this._targetId) {
			this._button.setAttribute("aria-controls", this._targetId);
		}

		this._updateButtonText();

		this._handleButtonClick = this._handleButtonClick.bind(this);
		this._button.addEventListener("click", this._handleButtonClick);

		this.appendChild(this._button);
	}

	_handleButtonClick(event) {
		event.preventDefault();
		this._shouldReturnFocus = true;
		this.toggleFullscreen();
	}

	_handleEscape(event) {
		if (event.key === "Escape" && this._isFullscreen()) {
			this.exitFullscreen();
		}
	}

	_handleFullscreenChange() {
		if (this._isFullscreen()) {
			// Listen for escape key when in fullscreen
			document.addEventListener("keydown", this._handleEscape);
		} else {
			// Remove escape listener when not in fullscreen
			document.removeEventListener("keydown", this._handleEscape);

			// Return focus to button if it triggered fullscreen
			if (this._shouldReturnFocus && this._button) {
				this._button.focus();
				this._shouldReturnFocus = false;
			}
		}
	}

	_isFullscreen() {
		return (
			document.fullscreenElement === this._target ||
			document.webkitFullscreenElement === this._target ||
			document.mozFullScreenElement === this._target
		);
	}

	/**
	 * Enter fullscreen mode
	 */
	async enterFullscreen() {
		if (!this._target) {
			console.warn("fullscreen-control: No target element to make fullscreen");
			return;
		}

		try {
			if (this._target.requestFullscreen) {
				await this._target.requestFullscreen();
			} else if (this._target.webkitRequestFullscreen) {
				await this._target.webkitRequestFullscreen();
			} else if (this._target.mozRequestFullScreen) {
				await this._target.mozRequestFullScreen();
			}

			this.dispatchEvent(
				new CustomEvent("fullscreen-control:enter", {
					bubbles: true,
					composed: true,
				}),
			);
		} catch (error) {
			console.error("Error entering fullscreen:", error);
		}
	}

	/**
	 * Exit fullscreen mode
	 */
	async exitFullscreen() {
		try {
			if (document.exitFullscreen) {
				await document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				await document.webkitExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				await document.mozCancelFullScreen();
			}

			this.dispatchEvent(
				new CustomEvent("fullscreen-control:exit", {
					bubbles: true,
					composed: true,
				}),
			);
		} catch (error) {
			console.error("Error exiting fullscreen:", error);
		}
	}

	/**
	 * Toggle fullscreen mode
	 */
	toggleFullscreen() {
		if (this._isFullscreen()) {
			this.exitFullscreen();
		} else {
			this.enterFullscreen();
		}
	}

	_ensureTargetId() {
		if (!this._target) {
			return null;
		}

		const existingId = this._target.getAttribute("id");
		if (existingId && existingId.trim() !== "") {
			return existingId;
		}

		const generatedId = FullscreenControlElement._generateTargetId();
		this._target.setAttribute("id", generatedId);
		return generatedId;
	}

	static _generateTargetId() {
		FullscreenControlElement._idCounter += 1;
		return `fullscreen-control-target-${FullscreenControlElement._idCounter}`;
	}
}

FullscreenControlElement._idCounter = 0;

function defineFullscreenControl(tagName = "fullscreen-control") {
	const hasWindow = typeof window !== "undefined";
	const registry = hasWindow ? window.customElements : undefined;

	if (!registry || typeof registry.define !== "function") {
		return false;
	}

	if (!registry.get(tagName)) {
		registry.define(tagName, FullscreenControlElement);
	}

	return true;
}

defineFullscreenControl();
