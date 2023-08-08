class CreateFolderFavorites < ActiveRecord::Migration[7.0]
  def change
    create_table :folder_favorites do |t|
      t.references :favorite, null: false, foreign_key: true
      t.references :folder, null: false, foreign_key: true

      t.timestamps
    end
  end
end
