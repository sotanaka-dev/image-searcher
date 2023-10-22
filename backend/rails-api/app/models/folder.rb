class Folder < ApplicationRecord
  has_many :folder_favorites, dependent: :destroy
  has_many :favorites, through: :folder_favorites
  belongs_to :user

  validates :name,
            uniqueness: true,
            length: { in: 1..10 }

  # favoritesのcountメソッドをfavorites_countで呼び出し、お気に入りの件数を取得可能に
  delegate :count, to: :favorites, prefix: true
end
