class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :service
  has_many :folder_favorites, dependent: :destroy
  has_many :folders, through: :folder_favorites
end
