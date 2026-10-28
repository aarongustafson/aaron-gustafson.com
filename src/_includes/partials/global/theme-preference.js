(function (window, document) {
	var allowed = ["system", "light", "dark"],
		theme = "system",
		saved,
		cookie;

	try {
		saved = window.localStorage.getItem("theme-switcher");
	} catch (error) {
		console.warn("Could not read the saved theme.", error);
	}

	try {
		cookie = document.cookie.split(";").map(function (part) {
			return part.trim();
		}).find(function (part) {
			return part === "darkmode=true" || part === "darkmode=false";
		});
	} catch (error) {
		console.warn("Could not read the legacy theme cookie.", error);
	}

	if (allowed.indexOf(saved) !== -1) {
		theme = saved;
	} else if (cookie) {
		theme = cookie === "darkmode=true" ? "dark" : "light";
		try {
			window.localStorage.setItem("theme-switcher", theme);
			if (window.localStorage.getItem("theme-switcher") !== theme) {
				console.warn("The migrated theme could not be verified in local storage.");
			}
		} catch (error) {
			console.warn("Could not migrate the saved theme.", error);
		}
	}
	if (cookie) {
		try {
			if (window.localStorage.getItem("theme-switcher") === theme) {
				document.cookie = "darkmode=; Path=/; Max-Age=0; SameSite=Lax";
			}
		} catch (error) {
			console.warn("Could not retire the legacy theme cookie.", error);
		}
	}
	document.documentElement.setAttribute("data-theme", theme);
})(window, document);
