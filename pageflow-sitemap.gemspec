$:.push File.expand_path('../lib', __FILE__)

# Maintain your gem's version:
require 'pageflow/sitemap/version'

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = 'pageflow-sitemap'
  s.version     = Pageflow::Sitemap::VERSION
  s.authors     = ['Codevise Solutions Ltd.']
  s.email       = ['info@codevise.de']
  s.homepage    = 'https://github.com/codevise/pageflow-sitemap'
  s.summary     = 'Interactive sitemap view in editor-'
  s.license     = 'MIT'

  s.files         = `git ls-files`.split($/)
  s.test_files    = s.files.grep(%r{^(test|spec|features)/})
  s.require_paths = ['lib']

  s.required_ruby_version = '~> 2.1'

  s.add_runtime_dependency 'pageflow', ['>= 0.10', '< 14']

  s.add_development_dependency 'pageflow-support', ['>= 0.10', '< 13']
  s.add_development_dependency 'teaspoon-mocha', '~> 2.3'

  # Semantic versioning rake tasks
  s.add_development_dependency 'semmy', '~> 1.0'
end
