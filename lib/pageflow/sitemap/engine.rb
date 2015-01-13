module Pageflow
  module Sitemap
    class Engine < Rails::Engine
      isolate_namespace Pageflow::Sitemap

      config.autoload_paths << File.join(config.root, 'lib')
    end
  end
end
