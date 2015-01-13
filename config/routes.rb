module Pageflow
  Sitemap::Engine.routes.draw do

    get '/test' => 'foo_test#index'

  end
end
