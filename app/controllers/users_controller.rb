class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      sign_in @user
      flash[:success] = "Welcome, " + @user.name + "!"
      redirect_to root_path
    else
      render 'new'
    end
  end

	def edit
		@user = current_user
	end

	def update
		@user = current_user
		if @user.update(user_params)
      flash[:success] = "Updated Information!"
      redirect_to root_path
		else
			flash[:errors] = @user.errors
			render 'edit'
		end
	end

  private
    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end
end
