require 'test_helper'

class DebtTest < ActiveSupport::TestCase
	test "Initialization rules" do
		d = makeDefaultDebt()
		d.name = ""
		assert(d.save == false, "Should not have saved debt with empty name")
		d.name = "Good name"

		d.amount = -100
		assert(d.save == false, "Should not have saved debt with a negative amount")
		d.amount = 1000

		d.interest_rate = -0.10
		assert(d.save == false, "Should not have saved debt with a negative interest rate")
		d.interest_rate = 0.12

		d.min_monthly_payment = -10
		assert(d.save == false, "Should not have saved debt with negative monthly payment")
		d.min_monthly_payment = 10

		schedule_id = d.schedule_id
		d.schedule_id = 55555
		assert(d.save == false, "Should not have saved with invalid schedule id")
		d.schedule_id = schedule_id

		assert(d.save == true, "Should have saved correctly, but didn't")
	end

	# Creates a default debt, for the sake of convenience
	def makeDefaultDebt
		d = Debt.new
		d.name = "New debt name"
		d.amount = 1000
		d.interest_rate = 0.12
		d.min_monthly_payment = 25
		s = Schedule.find_by(name: 'MyString')
		d.schedule_id = s.id
		return d
	end
end
