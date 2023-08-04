class Folder < ApplicationRecord
  has_many :folder_favorites, dependent: :destroy
  has_many :favorites, through: :folder_favorites
  belongs_to :user

  validates :name, uniqueness: true
end
