class CalculationController < ApplicationController
	def calculate
		@debt_array = []
		_schedule = Schedule.find_by(user_id: current_user.id)
		unless _schedule.nil?
			if _schedule.salary
				@salary = _schedule.salary
			end
			_d = Debt.find_by(schedule_id: _schedule.id)

			if _d
				@debt_array.push(_d)
			end
		end
	end
end
