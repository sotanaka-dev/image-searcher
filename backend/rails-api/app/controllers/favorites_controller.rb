class FavoritesController < ApplicationController
  before_action :authenticate_request

  def exists
    favorite = @current_user.favorites.find_by(post_id: params[:post_id])
    render json: { exists: favorite.present?, favoriteId: favorite&.id }
  end

  def index
    favorites = @current_user.favorites.includes(:service).order(created_at: :desc)
    posts = fetch_sns_posts_from_favorites(favorites)
    render json: { posts: }, status: :ok
  end

  def favorites_by_folder
    favorite_ids = FolderFavorite.where(folder_id: params[:id]).pluck(:favorite_id)
    favorites = @current_user.favorites.includes(:service).where(id: favorite_ids).order(created_at: :desc)
    posts = fetch_sns_posts_from_favorites(favorites)
    render json: { posts: }, status: :ok
  end

  def create
    favorite = @current_user.favorites.new(
      post_id: favorite_params[:post_id],
      service_id: favorite_params[:service_id]
    )

    if favorite.save
      render json: { favorite: }, status: :created
    else
      render json: { errors: favorite.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    favorite = @current_user.favorites.find(params[:id])
    favorite.destroy!
    head :no_content
  end

  def destroy_multiple
    favorite_ids = destroy_multiple_params
    @current_user.favorites.where(id: favorite_ids).destroy_all
    head :no_content
  end

  private

  def favorite_params
    params.require(:favorite).permit(:post_id, :service_id)
  end

  def destroy_multiple_params
    params.require(:favorite_ids)
  end

  def service_name_to_class(service_name)
    "#{service_name.downcase.capitalize}Service".constantize
  end

  def fetch_sns_posts_from_favorites(favorites)
    favorites.map do |favorite|
      service = service_name_to_class(favorite.service.name).new
      post_data = service.get_single_post(favorite.post_id)
      post_data[:post]&.merge!(id: favorite.id)
      post_data[:post]
    end.compact
  end
end
