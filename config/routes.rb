Rails.application.routes.draw do
  resources :images
  root 'images#index'
  post '/images/get_random_images', to: 'images#get_random_images'
  post '/images/get_code_name', to: 'images#get_code_name'
  post '/images/get_current_cost', to: 'images#get_current_cost'
  post '/images/get_current_power', to: 'images#get_current_power'


end
