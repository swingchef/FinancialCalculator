class CreateDebts < ActiveRecord::Migration
  def change
    create_table :debts do |t|
      t.string :name
      t.integer :amount
      t.float :interest_rate
      t.integer :min_monthly_payment

      t.timestamps
    end
  end
end
