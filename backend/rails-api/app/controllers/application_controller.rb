require 'jwt_helper'

class ApplicationController < ActionController::API
  include JwtHelper

  private

  def authenticate_request
    auth_header = request.headers['Authorization']
    token = auth_header.split(' ')[1]
    payload = decode_token(token)

    @current_user = User.find_by(id: payload[0]['user_id'])

    return if @current_user

    render json: { error: 'Not Authorized' }, status: :unauthorized
  end
end
