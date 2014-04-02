class AddScheduleIdToDebt < ActiveRecord::Migration
  def change
	  add_column :debts, :schedule_id, :integer
	  add_index :debts, :schedule_id
  end
end
