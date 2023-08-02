class FavoritesController < ApplicationController
  before_action :authenticate_request

  def exists
    favorite = Favorite.find_by(user_id: @current_user.id, post_id: params[:post_id])
    render json: { exists: favorite.present?, favoriteId: favorite&.id }
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
end
