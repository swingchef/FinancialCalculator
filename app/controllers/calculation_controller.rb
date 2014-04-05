class CalculationController < ApplicationController
  def calculate
	  @debt_array = []
	  _schedule = Schedule.find_by(user_id: current_user.id)
	  unless _schedule.nil?
		  @debt_array.push(Debt.find_by(schedule_id: _schedule.id))
	  end
  end
end
