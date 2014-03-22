module SessionsHelper

  # Signs in the given user, and saves a new remember_token to the user's browser
  def sign_in(user)
    remember_token = User.new_remember_token

    # Sets the session cookie to expire in 20 years (we may want this shortened)
    cookies.permanent[:remember_token] = remember_token
    user.update_attribute(:remember_token, User.hash(remember_token))
    self.current_user = user
  end

  def current_user=(user)
    @current_user = user
  end

  def current_user
    remember_token = User.hash(cookies[:remember_token])
    @current_user ||= User.find_by(remember_token: remember_token)
  end
end
