class CalculationController < ApplicationController
	def calculate
		@debt_array = []
		_schedule = Schedule.find_by(user_id: current_user.id)
		unless _schedule.nil?
			if _schedule.salary
				@salary = _schedule.salary
				@debt_array = _schedule.debts
			end
		end
	end
end
