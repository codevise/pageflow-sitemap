module Pageflow
  module Sitemap
    class Engine < Rails::Engine
      isolate_namespace Pageflow::Sitemap

      config.autoload_paths << File.join(config.root, 'lib')
      config.i18n.load_path += Dir[config.root.join('config', 'locales', '**', '*.yml').to_s]
    end
  end
end
