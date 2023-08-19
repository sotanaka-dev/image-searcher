class SearchHistory < ApplicationRecord
  belongs_to :user

  validates :keyword, presence: true

  after_create :trim_histories

  private

  def trim_histories
    limit = 30
    excess_count = user.search_histories.count - limit

    user.search_histories.order(:created_at).limit(excess_count).destroy_all if excess_count.positive?
  end
end
