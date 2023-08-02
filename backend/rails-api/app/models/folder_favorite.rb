class FolderFavorite < ApplicationRecord
  belongs_to :folder
  belongs_to :favorite
end
