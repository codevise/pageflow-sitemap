module Pageflow
  module Sitemap
    class Plugin < Pageflow::Plugin
      def configure(config)
        config.features.register('sitemap')
      end
    end
  end
end
