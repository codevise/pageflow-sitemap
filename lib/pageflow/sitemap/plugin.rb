module Pageflow
  module Sitemap
    class Plugin < Pageflow::Plugin
      name 'sitemap'

      def configure(config)
        config.features.register('sitemap')
        config.entry_modes.register('sitemap', features: {sitemap: true})
      end
    end
  end
end
