Rails.application.routes.draw do
  
  devise_for :users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  mount Pageflow::GraphEditor::Engine => "/pageflow/graph_editor"

  Pageflow.routes(self)
end
