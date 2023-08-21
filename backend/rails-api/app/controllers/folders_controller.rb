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
    folder = @current_user.folders.new(folder_params)
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
    @folder.destroy!
    head :no_content
  end

  def add_favorites
    folder_ids = favorites_params[:folder_ids]
    favorite_ids = favorites_params[:favorite_ids]

    # productでfolder_idsとfavorite_idsの全ての組み合わせを生成し、mapでハッシュ形式に変換
    relations = folder_ids.product(favorite_ids).map { |folder_id, favorite_id| { folder_id:, favorite_id: } }
    FolderFavorite.insert_all(relations)

    render json: {}, status: :ok
  end

  def remove_favorites
    favorite_ids = favorites_params[:favorite_ids]
    FolderFavorite.where(folder_id: @folder.id, favorite_id: favorite_ids).destroy_all

    head :no_content
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
