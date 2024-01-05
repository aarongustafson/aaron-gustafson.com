// The current banner CTA URL
let latestBannerUrl = "/notebook/a-grand-experiment/";
let savedKey = localStorage.getItem("banner--cta-url");

// Hide if the banner URL is the same as the saved preference banner URL
if(savedKey === latestBannerUrl) {
  document.documentElement.classList.add("banner--hide");
}