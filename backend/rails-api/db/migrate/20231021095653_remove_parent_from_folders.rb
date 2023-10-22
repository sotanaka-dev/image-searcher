class RemoveParentFromFolders < ActiveRecord::Migration[7.0]
  def change
    remove_reference :folders, :parent, foreign_key: { to_table: :folders }
  end
end
