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

    selected_images.each_with_index do |x, index|
      if x.starts_with?('/assets/')
        short = x.gsub("/assets/","")
        new_image = Image.find_by(short_name: short)&.url
        if new_image.nil?
          selected_images[index] = short
        else
          selected_images[index] = new_image
        end
      end
    end
    puts selected_images


    images = Image.where.not(url: selected_images).order(Arel.sql('RAND()')).limit(count)

    render json: { images: images }
  end

  def test_method
    render json: 23
  end
end
