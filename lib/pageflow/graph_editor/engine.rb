module Pageflow
  module GraphEditor
    class Engine < Rails::Engine
      isolate_namespace Pageflow::GraphEditor

      config.autoload_paths << File.join(config.root, 'lib')
    end
  end
end
