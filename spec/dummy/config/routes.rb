Rails.application.routes.draw do
  
  devise_for :users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  mount Pageflow::Sitemap::Engine => "/pageflow/sitemap"

  Pageflow.routes(self)
end
