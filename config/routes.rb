module Pageflow
  GraphEditor::Engine.routes.draw do

    get '/test' => 'foo_test#index'

  end
end
