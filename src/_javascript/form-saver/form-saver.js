(function (window, document) {
	if (!("querySelector" in document)) {
		return;
	}
	function formSaver($form) {
		if (!("localStorage" in window)) {
			return;
		}

		var page_key = window.location.toString(),
			$all_fields = $form.querySelectorAll(
				"input:not([disabled]),select:not([disabled]),textarea:not([disabled])",
			),
			$fields = [],
			ignored_names = [],
			count,
			$field,
			data = {},
			typing = false;

		count = $all_fields.length;
		while (count--) {
			$field = $all_fields[count];
			if (
				$field.type == "password" ||
				$field.hasAttribute("data-form-saver-ignore")
			) {
				if ($field.name) {
					ignored_names.push($field.name);
				}
			} else {
				$fields.push($field);
			}
		}
		data = $form.getAttribute("data-form-saver-cleanup");
		if (data) {
			ignored_names = ignored_names.concat(data.split(/\s+/));
		}
		data = {};

		// Field functions
		function getValue($field) {
			var type = $field.type,
				value,
				$related_fields,
				len;
			switch (type) {
				case "radio":
					console.log("radio");
					value = document.querySelector(
						"[name=" + $field.name + "]:checked",
					).value;
					break;
				case "checkbox":
					console.log("checkbox");
					value = [];
					$related_fields = document.querySelectorAll(
						'[name="' + $field.name + '"]:checked',
					);
					len = $related_fields.length;
					while (len--) {
						value.push($related_fields[len].value);
					}
					break;
				default:
					console.log("everything else");
					value = $field.value;
					break;
			}
			return value;
		}
		function setValue($field, value) {
			var type = $field.type,
				len;
			switch (type) {
				case "radio":
					document.querySelector(
						"[name=" + $field.name + '][value="' + value + '"]',
					).checked = true;
					break;
				case "checkbox":
					if (value.constructor == Array) {
						len = value.length;
						while (len--) {
							document.querySelector(
								"[name=" + $field.name + '][value="' + value[len] + '"]',
							).checked = true;
						}
					}
					break;
				default:
					$field.value = value;
					break;
			}
		}

		// Form actions
		function save() {
			//console.log('saving');
			data = {};
			count = $fields.length;
			while (count--) {
				$field = $fields[count];
				data[$field.name] = getValue($field);
			}
			window.localStorage.setItem(page_key, JSON.stringify(data));
		}
		function reload() {
			//console.log('reloading');
			count = $fields.length;
			data = window.localStorage.getItem(page_key);
			if (data) {
				data = JSON.parse(data);
				var cleanup_count = ignored_names.length,
					cleaned = false;
				while (cleanup_count--) {
					if (
						Object.prototype.hasOwnProperty.call(
							data,
							ignored_names[cleanup_count],
						)
					) {
						delete data[ignored_names[cleanup_count]];
						cleaned = true;
					}
				}
				if (cleaned) {
					window.localStorage.setItem(page_key, JSON.stringify(data));
				}
				while (count--) {
					$field = $fields[count];
					if (data[$field.name] != undefined) {
						setValue($field, data[$field.name]);
					}
				}
			} else {
				data = {};
			}
		}

		// Event Handlers
		function throttleKeydownSave() {
			if (typing) {
				//console.log('typing');
				clearTimeout(typing);
				resizing = null;
			}
			typing = setTimeout(doneTyping, 300);
		}
		function doneTyping() {
			//console.log('done typing');
			clearTimeout(typing);
			typing = null;
			save();
		}
		$form.addEventListener("keydown", throttleKeydownSave, false);
		$form.addEventListener("change", save, false);
		$form.addEventListener("blur", save, false);
		//console.log('events set');

		// init
		reload();
	}

	// auto-load
	new formSaver(document.querySelector('main form[method="post"]'));
})(this, this.document);
