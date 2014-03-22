class SessionsController < ApplicationController
	def new
	end

	def create
		user = User.find_by(email: params[:session][:email].downcase)
		if user && user.authenticate(params[:session][:password])
			# TODO Sign the user in and redirect to the user's show page
			render :inline => "Successfully logged in!"
		else
			# Create an error message and re-render the signin form
			puts 'Bad username / password'
			flash.now[:error] = "Invalid email/password combination"
			render 'new'
		end
	end

	def destroy
	end
end