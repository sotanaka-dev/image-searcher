class FoldersController < ApplicationController
  before_action :authenticate_request
  before_action :set_folder, except: [:index, :create, :add_favorites]

  def index
    folders = if params[:parent_id].present?
                @current_user.folders.where(parent_id: params[:parent_id])
              elsif params[:all] == 'true'
                @current_user.folders
              else
                @current_user.folders.where(parent_id: nil)
              end
    render json: { folders: folders.as_json(methods: :favorites_count) }, status: :ok
  end

  def show
    render json: { folder: @folder }, status: :ok
  end

  def create
    folder = @current_user.folders.build(folder_params)
    if folder.save
      render json: { folder: }, status: :created
    else
      render json: { errors: folder.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @folder.update(folder_params)
      render json: { folder: @folder }, status: :ok
    else
      render json: { errors: @folder.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @folder.destroy
      head :no_content
    else
      render json: {}, status: :unprocessable_entity
    end
  end

  def add_favorites
    folder_ids = favorites_params[:folder_ids]
    favorite_ids = favorites_params[:favorite_ids]

    begin
      ActiveRecord::Base.transaction do
        folder_ids.each do |folder_id|
          favorite_ids.each do |favorite_id|
            FolderFavorite.find_or_create_by!(folder_id:, favorite_id:)
          end
        end
      end
      render json: {}, status: :ok
    rescue ActiveRecord::RecordInvalid
      render json: {}, status: :unprocessable_entity
    end
  end

  def remove_favorites
    favorite_ids = favorites_params[:favorite_ids]

    begin
      ActiveRecord::Base.transaction do
        favorite_ids.each do |favorite_id|
          relation = FolderFavorite.find_by(folder_id: @folder.id, favorite_id:)
          relation&.destroy!
        end
      end
      render json: {}, status: :ok
    rescue ActiveRecord::RecordInvalid
      render json: {}, status: :unprocessable_entity
    end
  end

  private

  def set_folder
    @folder = Folder.find(params[:id])
  end

  def folder_params
    params.require(:folder).permit(:name, :parent_id)
  end

  def favorites_params
    params.permit(folder_ids: [], favorite_ids: [])
  end
end
