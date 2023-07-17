require 'jwt'

module JwtHelper
  def encode_token(payload)
    JWT.encode payload, secret_key, 'HS256'
  end

  def decode_token(token)
    JWT.decode token, secret_key, true, { algorithm: 'HS256' }
  end

  private

  def secret_key
    Rails.application.credentials.secret_key_base
  end
end
