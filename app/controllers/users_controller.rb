class UsersController < ApplicationController
  def new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      sign_in @user
      flash[:success] = "Welcome to XYZZY!"
      redirect_to @user
    else
      render 'new'
    end
  end
end
