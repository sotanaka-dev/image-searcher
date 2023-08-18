class SearchHistory < ApplicationRecord
  belongs_to :user

  validates :keyword, presence: true
end
