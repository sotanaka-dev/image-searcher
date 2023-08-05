class FavoritesController < ApplicationController
  before_action :authenticate_request

  def exists
    favorite = Favorite.find_by(user_id: @current_user.id, post_id: params[:post_id])
    render json: { exists: favorite.present?, favoriteId: favorite&.id }
  end

  def index
    favorites = @current_user.favorites.includes(:service).order(created_at: :desc)

    posts = favorites.map do |favorite|
      service = service_name_to_class(favorite.service.name).new
      post_data = service.get_single_post(favorite.post_id)

      post_data[:post] = post_data[:post].merge({ id: favorite.id }) if post_data[:post]

      post_data[:post] || nil
    end.compact

    render json: posts, status: :ok
  end

  def create
    favorite = Favorite.new(
      user_id: @current_user.id,
      post_id: favorite_params[:post_id],
      service_id: favorite_params[:service_id]
    )

    if favorite.save
      render json: {}, status: :created
    else
      render json: {}, status: :unprocessable_entity
    end
  end

  def destroy
    favorite = Favorite.find_by(id: params[:id])
    if favorite&.destroy
      render json: {}, status: :no_content
    else
      render json: {}, status: :unprocessable_entity
    end
  end

  private

  def favorite_params
    params.require(:favorite).permit(:post_id, :service_id)
  end

  def service_name_to_class(service_name)
    "#{service_name.downcase.capitalize}Service".constantize
  end
end
