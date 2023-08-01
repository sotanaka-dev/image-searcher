require 'jwt_helper'

class UsersController < ApplicationController
  include JwtHelper
  before_action :authenticate_request, except: [:create]

  def create
    user = User.new(user_params)

    if user.save
      token = encode_token({ user_id: user.id })
      render json: { user: user.as_json_response(token) }, status: :created
    else
      render json: { errors: user.errors }, status: :unprocessable_entity
    end
  end

  def update_username
    if @current_user.update(username: params[:username])
      render json: { username: @current_user.username }, status: :ok
    else
      render json: { errors: @current_user.errors }, status: :unprocessable_entity
    end
  end

  def update_password
    params[:password] = nil if params[:password].blank?

    if @current_user.update(password: params[:password])
      render json: {}, status: :ok
    else
      render json: { errors: @current_user.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    if @current_user.destroy
      render json: {}, status: :no_content
    else
      render json: { error: 'Failed to delete user' }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :password)
  end
end
