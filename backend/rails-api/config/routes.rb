Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  get '/healthcheck', to: proc { [200, {}, ['']] }

  resources :users, except: [:update, :destroy] do
    collection do
      patch 'username', to: 'users#update_username'
      patch 'password', to: 'users#update_password'
      delete '', to: 'users#destroy'
    end
  end

  resources :favorites do
    collection do
      get 'exists'
      get 'folder/:id', to: 'favorites#favorites_by_folder'
    end
  end

  resources :folders do
    collection do
      post 'add_favorites'
    end
  end

  post '/users/signin', to: 'authentication#sign_in'

  get '/search', to: 'search#search'
end
