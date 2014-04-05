class DebtsController < ApplicationController
	def create
		@debt = Debt.new(debt_params)
		_schedule = Schedule.find_by(user_id: current_user.id)
		# TODO Add exception handling here, in case we cannot create the schedule
		# TODO Perhaps redesign this, as the controller might not be the best place
		# to perform these functions
		# Get the schedule_id (or create it)
		if _schedule.nil?
			_schedule = Schedule.new(user_id: current_user.id)
			_schedule.save
		end
		@debt.schedule_id = _schedule.id
		# Check for successful creation
		# TODO Return the appropriate error code
		if (@debt.save)
			render :inline => 'Successfully saved debt: ' + @debt.name
		else
			@errorString = 'Failed to save debt: ' + @debt.name + '\n'
			@debt.errors.full_messages.each do |msg|
				@errorString += msg + '\n'
			end
			@errorString += "user_id = #{current_user.id}"
			render :inline => @errorString
		end
	end

	private
		def debt_params
			params.permit(:name, :amount, :interest_rate, :min_monthly_payment, :schedule_id)
		end
end
