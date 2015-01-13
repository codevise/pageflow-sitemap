$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "pageflow/sitemap/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "pageflow-sitemap"
  s.version     = Pageflow::Sitemap::VERSION
  s.authors     = ["Codevise Solutions Ltd."]
  s.email       = ["info@codevise.de"]
  s.homepage    = "http://pageflow.io"
  s.summary     = "Summary of PageflowSitemap."
  s.description = "Description of PageflowSitemap."
  s.license     = "MIT"

  s.files         = `git ls-files`.split($/)
  s.executables   = s.files.grep(%r{^bin/}) { |f| File.basename(f) }
  s.test_files    = s.files.grep(%r{^(test|spec|features)/})
  s.require_paths = ["lib"]

  s.add_runtime_dependency "pageflow"

end
