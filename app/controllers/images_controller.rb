class ImagesController < ApplicationController
  before_action :set_image, only: %i[ show edit update destroy ]

  # GET /images or /images.json
  def index
    @empty_boxes = 12 - Image.where.not(url: nil).count
    @random_images = Image.where.not(url: nil).order("RAND()").limit(3)
  end

  def get_random_images
    count = params[:count].to_i
    selected_images = params[:selectedImages]

    images = Image.where.not(url: selected_images).order(Arel.sql('RAND()')).limit(count)

    render json: { images: images }
  end
end
