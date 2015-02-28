require "pageflow/sitemap/engine"

module Pageflow
  module Sitemap
    def self.plugin
      Sitemap::Plugin.new
    end
  end
end
