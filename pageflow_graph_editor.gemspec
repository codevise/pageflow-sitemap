$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "pageflow/graph_editor/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "pageflow_graph_editor"
  s.version     = Pageflow::GraphEditor::VERSION
  s.authors     = ["Codevise Solutions Ltd."]
  s.email       = ["info@codevise.de"]
  s.homepage    = "http://pageflow.io"
  s.summary     = "Summary of PageflowGraphEditor."
  s.description = "Description of PageflowGraphEditor."
  s.license     = "MIT"

  s.files         = `git ls-files`.split($/)
  s.executables   = s.files.grep(%r{^bin/}) { |f| File.basename(f) }
  s.test_files    = s.files.grep(%r{^(test|spec|features)/})
  s.require_paths = ["lib"]

  s.add_runtime_dependency "pageflow"

end
