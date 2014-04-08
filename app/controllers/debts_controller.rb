class DebtsController < ApplicationController

	# TODO Protect this against stored XSS attacks
	def create
		# TODO Add code to update instead of create
		if params[:id] == 0
			# This is a new debt
			@debt = Debt.new(debt_params)
			@debt.id = nil # Reset the id to nil, as the db needs to assign the ID
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

			checkResult = @debt.save
		else
			# This debt already existed
			# TODO This is not secure, as a client could potentially overwrite the debts of others
			# I need to check to make sure that this id belongs to the current_user
			@debt = Debt.find(params[:id])

			checkResult = @debt.update(debt_params)
		end
		# Check for successful creation
		# TODO Return the appropriate error code
		if (checkResult)
			render :inline => 'Successfully saved debt: ' + @debt.name
		else
			_errorString = 'Failed to save debt: ' + @debt.name + '\n'
			@debt.errors.full_messages.each do |msg|
				_errorString += msg + '\n'
			end
			_errorString += "user_id = #{current_user.id}"
			render :inline => _errorString
		end
	end

	# TODO Figure out how to delete Debts
	def delete
		@debt = Debt.find(params[:id])
		_dName = @debt.name
		puts "Deleting Debt: " + @debt.name
		# TODO Again, correct error codes need to be returned
		if @debt.destroy
			render :inline => 'Successfully deleted debt'
		else
			render :inline => 'Failed to delete debt'
		end
	end
	private
		def debt_params
			params.permit(:id, :name, :amount, :interest_rate, :min_monthly_payment, :schedule_id)
		end
end
