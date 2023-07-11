Rails.application.routes.draw do
  resources :images
  root 'images#index'
  post '/images/get_random_images', to: 'images#get_random_images'
end