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

  def get_code_name
    image_url = params[:imageUrl]
    if image_url.starts_with?('/assets/')
      image_url = image_url.gsub("/assets/","")
    end
      code_name =  Image.find_by(short_name: image_url)&.code_name
      if code_name.nil?
        code_name = Image.find_by(url: image_url)&.code_name
      end
    render json: {code_name: code_name}
  end

  def get_current_cost
    image_url = params[:imageUrl]
    if image_url.starts_with?('/assets/')
      image_url = image_url.gsub("/assets/","")
    end
    cost =  Image.find_by(short_name: image_url)&.cost
    if cost.nil?
      cost = Image.find_by(url: image_url)&.cost
    end
    render json: {cost: cost}
  end

  def get_current_power
    image_url = params[:imageUrl]
    if image_url.starts_with?('/assets/')
      image_url = image_url.gsub("/assets/","")
    end
    power =  Image.find_by(short_name: image_url)&.power
    if power.nil?
      power = Image.find_by(url: image_url)&.power
    end
    render json: {power: power}
  end

end
