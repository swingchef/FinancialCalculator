class ScheduleController < ApplicationController
	def create
		# NOTE: Normally we would require the client to send us the schedule_id
		# But currently, we are making that process transparent to the client.
		# This allows us to expand the schedule later on, without the additional
		# overhead right now.
		_schedule = Schedule.find_by(user_id: current_user.id)

		if _schedule.nil?
			_schedule = Schedule.new(user_id: current_user.id)
		end

		_schedule.salary = params[:salary]
		puts 'Salary equals ' + _schedule.salary.to_s()

		_returnString = ''
		if (_schedule.save)
			_returnString = 'Successfully saved schedule'
		else
			_returnString = 'Failed to save schedule'
		end

		render :inline => _returnString
	end
end
