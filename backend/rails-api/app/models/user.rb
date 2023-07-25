class User < ApplicationRecord
  has_secure_password

  validates :username,
            presence: true,
            uniqueness: true,
            format: { with: /\A[a-zA-Z0-9_]+\z/, message: 'only allows letters, numbers, and underscores' },
            length: { in: 3..30 }
  validates :password,
            length: { minimum: 8 },
            if: -> { new_record? || changes[:password_digest] }

  def as_json_response(token)
    {
      token:,
      username:
    }
  end
end
