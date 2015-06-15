# Caches
cache = File.expand_path('../../../.cache', __FILE__)
FileUtils.mkdir_p( cache )
cache_urls = "#{cache}/facebook-og-urls.yml"
cache_fixed = "#{cache}/facebook-og-fixed.yml"

# Use: rake fix_opengraph
desc "Fix Facebook OpenGraph Sharing"
task :fix_opengraph do
  if File.exists?(cache_urls)
    if File.exists?(cache_fixed)
      fixed = open(cache_fixed) { |f| YAML.load(f) }
    else
      fixed = []
    end
    urls = open(cache_urls) { |f| YAML.load(f) }
    not_fixed = Set.new(urls) - fixed
    not_fixed.each do |url|
      facebook_og_endpoint_url = 'https://graph.facebook.com/'
      puts "Forcing Facebook to scrape #{url}"
      response = `curl -s -d \"scrape=true&method=post&id=#{url}\" --get #{facebook_og_endpoint_url}`
      response = JSON.parse(response)
      if response.has_key?('title')
        fixed.push( url )
      end
    end
    File.open(cache_fixed, 'w') { |f| YAML.dump(fixed, f) }
  end
end