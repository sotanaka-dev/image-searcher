Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  scope :api do
    post '/users', to: 'users#create'
    post '/users/signin', to: 'authentication#sign_in'

    get '/search', to: 'search#search'
  end
end
