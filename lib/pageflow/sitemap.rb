require "pageflow/sitemap/engine"
require "pageflow/sitemap/version"

module Pageflow
  module Sitemap
    def self.plugin
      Sitemap::Plugin.new
    end
  end
end
