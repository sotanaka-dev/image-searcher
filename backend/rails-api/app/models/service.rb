class Service < ApplicationRecord
  has_many :favorites, dependent: :destroy

  validates :name, uniqueness: true
end
