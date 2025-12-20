(function (window, document) {
	if (!("querySelector" in document)) {
		return;
	}

	function prepopulateForm() {
		function getQuery() {
			if (url.indexOf("?") == -1) return false;
			var qs = url.substring(url.indexOf("?") + 1).split("&");
			for (var i = 0, result = {}; i < qs.length; i++) {
				qs[i] = qs[i].split("=");
				result[qs[i][0]] = decodeURIComponent(qs[i][1].replace(/\+/g, "%20"));
			}
			return result;
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

		var url = window.location.toString(),
			GET = getQuery();

		if (GET && "prepopulateForm_config" in window) {
			for (var key in prepopulateForm_config) {
				var $field = document.querySelector("[name=" + key + "]"),
					value = prepopulateForm_config[key];
				if ($field && value in GET) {
					setValue($field, GET[value]);
				}
			}
		}
	}

	// auto-load
	new prepopulateForm();
})(this, this.document);
