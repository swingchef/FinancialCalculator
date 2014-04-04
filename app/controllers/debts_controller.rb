class DebtsController < ApplicationController
	def create
		@debt = Debt.new(debt_params)
		render 'new'
	end

	private
		def debt_params
			params.require(:debt).permit(:name, :amount, :interest_rate, :min_monthly_payment)
		end
end
