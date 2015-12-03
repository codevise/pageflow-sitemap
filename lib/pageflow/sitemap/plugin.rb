module Pageflow
  module Sitemap
    class Plugin < Pageflow::Plugin
      def configure(config)
        config.features.register('sitemap') do |feature_config|
          feature_config.help_entries.register('pageflow.sitemap.help_entries.main', priority: 6)
        end
      end
    end
  end
end
