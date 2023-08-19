class SearchHistoriesController < ApplicationController
  before_action :authenticate_request

  def index
    search_histories = @current_user.search_histories.order(created_at: :desc)
    render json: { search_histories: }, status: :ok
  end

  def create
    search_history = @current_user.search_histories.new(search_history_params)

    if search_history.save
      render json: { search_history: }, status: :created
    else
      render json: { errors: search_history.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    search_history = @current_user.search_histories.find(params[:id])

    if search_history.destroy
      head :no_content
    else
      head :internal_server_error
    end
  end

  private

  def search_history_params
    params.require(:search_history).permit(:keyword)
  end
end
