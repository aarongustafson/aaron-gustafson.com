# frozen_string_literal: true

# A Liquid tag for Jekyll sites that allows embedding Gists and showing code for non-JavaScript enabled browsers and readers.
# by: Brandon Tilly
# Source URL: https://gist.github.com/1027674
# Post http://brandontilley.com/2011/01/31/gist-tag-for-jekyll.html
#
# Example usage: {% gist [guid] [filename]? [embed]? [username]? %} //embeds a gist for this plugin

require 'cgi'
require 'digest/md5'
require 'net/https'
require 'uri'

module Jekyll
  class GistTag < Liquid::Tag
    def initialize(tag_name, text, token)
      @text           = text
      @cache_disabled = false
      @embed_code     = false
      super
    end

    def render(context)
      site            = context.registers[:site]
      @config         = site.config
      @encoding       = @config['encoding'] || 'UTF-8'

      @tag_config     = @config['gist_tag']
      @user           = @tag_config['user'] || ''
      @cache_disabled = @tag_config['cache'] == false

      unless @cache_disabled
        @cache_folder = site.in_source_dir(@tag_config['cache_folder'] || '.jekyll-cache')
        @cache_folder = File.join @cache_folder, 'gists'
        Dir.mkdir(@cache_folder) unless File.exist?(@cache_folder)
      end

      guid = ''
      filename = ''
      if @text.match(/^[a-zA-Z\d]*\s.*?$/)
        string = @text.gsub(/\s+/, ' ').strip
        tag_data = string.split(' ')
        guid        = tag_data[0] if tag_data[0]
        filename    = tag_data[1] if tag_data[1]
        @embed_code = tag_data[2] if tag_data[2]
        @user       = tag_data[3] if tag_data[3]
      else
        guid = @text.strip
      end

      if guid.empty?
        ''
      else
        code = get_gist_from_cache(guid, filename) || get_gist_from_web(guid, filename)
        ext = File.extname(filename).sub '.', ''
        link = get_gist_url(guid, filename)
        html_embed(code, ext, link)
      end
    end

    def html_embed(code, ext, link)
      <<~HTML
        ```#{ext}
        #{code}
        ```
        <p class="gist_link"><a href="#{link}">View as a GitHub Gist</a></p>
      HTML
    end

    def script_url_for(guid, filename)
      url = "https://gist.github.com/#{guid}.js"
      url = "#{url}?file=#{filename}" unless filename.nil? or filename.empty?
      url
    end

    def get_gist_url(guid, filename)
      url = "https://gist.github.com/#{@user}/#{guid}"
      unless filename.nil? or filename.empty?
        file_id = filename.sub('.','-')
        url = "#{url}#file-#{file_id}"
      end
      url
    end

    def cache(guid, file, data)
      unless @cache_disabled
        cache_file = get_cache_file_for guid, file
        File.open(cache_file, "w") do |io|
          io.write data
        end
      end
    end

    def get_gist_from_cache(guid, file)
      return nil if @cache_disabled
      cache_file = get_cache_file_for guid, file
      File.read cache_file if File.exist? cache_file
    end

    def get_cache_file_for(guid, filename)
      bad_chars = /[^a-zA-Z0-9\-_.]/
      guid     = guid.gsub bad_chars, ''
      filename = filename.gsub bad_chars, ''
      md5      = Digest::MD5.hexdigest "#{guid}-#{filename}"
      File.join @cache_folder, "#{guid}-#{filename}-#{md5}.cache"
    end

    def get_gist_from_web(guid, filename)
      raw_gist_url = "https://gist.githubusercontent.com/#{@user}/#{guid}/raw/"
      raw_gist_url = "#{raw_gist_url}#{filename}" unless filename.nil? or filename.empty?
      data = get_web_content(raw_gist_url)

      locations = Array.new
      while (data.code.to_i == 301 || data.code.to_i == 302)
        data = handle_gist_redirecting(data)
        break if locations.include? data.header['Location']
        locations << data.header['Location']
      end

      if data.code.to_i != 200
        raise RuntimeError, "Gist replied with #{data.code} for #{raw_gist_url}"
      end

      # Cleanup embed version
      code = data.body.force_encoding("UTF-8").encode(@encoding)
      # code = code.gsub( /document\.write\('/, '' ).gsub( /'\)/, '' ) # JS
      # code = code.gsub( /\\"/, '"' ).gsub( /\\\//, '/' ) # escaped stuff
      # code = code.gsub( /\\n/, "\n" ) # returns
      # code = code.encode(@encoding) # encode

      cache(guid, filename, code)
      code
    end

    def handle_gist_redirecting(data)
      redirected_url = data.header['Location']
      if redirected_url.nil? || redirected_url.empty?
        raise ArgumentError, "GitHub replied with a 302 but didn't provide a location in the response headers."
      end

      get_web_content(redirected_url)
    end

    def get_web_content(url)
      raw_uri           = URI.parse url
      proxy             = ENV['http_proxy']
      if proxy
        proxy_uri       = URI.parse(proxy)
        https           = Net::HTTP::Proxy(proxy_uri.host, proxy_uri.port).new raw_uri.host, raw_uri.port
      else
        https           = Net::HTTP.new raw_uri.host, raw_uri.port
      end
      https.use_ssl     = true
      https.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request           = Net::HTTP::Get.new raw_uri.request_uri
      data              = https.request request
    end
  end

  class GistTagNoCache < GistTag
    def initialize(tag_name, text, token)
      @cache_disabled = true
      super
    end
  end
end

Liquid::Template.register_tag('gist', Jekyll::GistTag)
Liquid::Template.register_tag('gistnocache', Jekyll::GistTagNoCache)
