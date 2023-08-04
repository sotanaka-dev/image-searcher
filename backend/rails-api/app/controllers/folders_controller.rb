class FoldersController < ApplicationController
  before_action :authenticate_request
  before_action :set_folder, except: [:index, :create]

  def index
    folders = if params[:parent_id].present?
                @current_user.folders.where(parent_id: params[:parent_id])
              else
                @current_user.folders.where(parent_id: nil)
              end
    render json: { folders: }, status: :ok
  end

  def show
    render json: { folder: @folder }, status: :ok
  end

  def create
    folder = @current_user.folders.build(folder_params)
    if folder.save
      render json: { folder: }, status: :created
    else
      render json: { errors: folder.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @folder.update(folder_params)
      render json: { folder: @folder }, status: :ok
    else
      render json: { errors: @folder.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    if @folder.destroy
      head :no_content
    else
      render json: { error: 'Failed to delete folder' }, status: :unprocessable_entity
    end
  end

  private

  def set_folder
    @folder = Folder.find(params[:id])
  end

  def folder_params
    params.require(:folder).permit(:name, :parent_id)
  end
end
