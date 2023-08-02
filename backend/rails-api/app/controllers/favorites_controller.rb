class FavoritesController < ApplicationController
  before_action :authenticate_request

  def exists
    favorite = Favorite.find_by(user_id: @current_user.id, post_id: params[:post_id])
    render json: { exists: favorite.present?, favoriteId: favorite&.id }
  end

  def create
    service = Service.find_by(name: favorite_params[:service_name])

    unless service
      render json: { error: 'Service not found' }, status: :unprocessable_entity
      return
    end

    favorite = Favorite.new(
      user_id: @current_user.id,
      post_id: favorite_params[:post_id],
      service_id: service.id
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
    params.require(:favorite).permit(:post_id, :service_name)
  end
end
