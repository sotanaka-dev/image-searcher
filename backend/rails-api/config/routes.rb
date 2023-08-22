Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  get '/healthcheck', to: proc { [200, {}, ['']] }

  post '/users/signin', to: 'authentication#sign_in'

  resources :users, only: [:create] do
    collection do
      patch 'username', to: 'users#update_username'
      patch 'password', to: 'users#update_password'
      delete '', to: 'users#destroy'
    end
  end

  get '/search', to: 'search#search'

  resources :search_histories, only: [:index, :create, :destroy]

  resources :favorites, only: [:index, :create, :destroy] do
    collection do
      get 'exists'
      get 'folder/:id', to: 'favorites#favorites_by_folder'
      delete 'destroy_multiple', to: 'favorites#destroy_multiple'
    end
  end

  resources :folders, only: [:index, :show, :create, :update, :destroy] do
    collection do
      post 'add_favorites'
      delete ':id/remove_favorites', to: 'folders#remove_favorites'
    end
  end
end
