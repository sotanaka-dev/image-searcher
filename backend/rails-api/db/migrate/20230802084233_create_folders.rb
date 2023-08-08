class CreateFolders < ActiveRecord::Migration[7.0]
  def change
    create_table :folders do |t|
      t.string :name, null: false, index: { unique: true }
      t.references :parent, foreign_key: { to_table: :folders }
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end
  end
end
