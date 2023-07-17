class User < ApplicationRecord
  has_secure_password

  validates :username,
            presence: true,
            uniqueness: true,
            format: { with: /\A[a-zA-Z0-9_]+\z/, message: 'only allows letters, numbers, and underscores' },
            length: { in: 3..30 }

  def as_json_response(token)
    {
      token:,
      username:
    }
  end
end
