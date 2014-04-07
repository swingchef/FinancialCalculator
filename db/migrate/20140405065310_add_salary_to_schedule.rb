class AddSalaryToSchedule < ActiveRecord::Migration
  def change
	  add_column :schedules, :salary, :integer
  end
end
