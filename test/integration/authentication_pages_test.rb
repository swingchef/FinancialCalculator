require 'test_helper'

class AuthenticationPagesTest < ActionDispatch::IntegrationTest

  test "login and browse site" do
    # TODO Set up https connection
    #https!

    # Verify we can hit the login page correctly
    #get "/signin"
    get signin_path
    assert_response :success

    # Create a new user to login
    user = User.new
    user.name = "Nathan Cooper"
    user.email = "nathan@example.com"
    myPass = "yabbaDabba"
    user.password = myPass
    user.password_confirmation = myPass
    assert(user.save, "Failed to save user for controller testing")

    # Log in with invalid credentials
    post_via_redirect sessions_path, {:session=>{:email=>'bad@here.com', :password=>'badpassword'}}
    assert(flash[:error], "Flash errors array was empty after bad user submission")
	## TODO assert the sign-in button is still visible
    assert(path == sessions_path, "Was not correctly re-direct back to the signin page, after a false login.")

	# Test that the flash cache is cleared on the next request
	get_via_redirect root_path
    assert(flash[:error].nil? || "" == flash[:error], "Flash errors array was not empty after a second request")

    # Log in and make sure you are correctly redirected
    post_via_redirect sessions_path, {:session=>{:email=>user.email, :password=>myPass}}
    assert_response :success
	## TODO assert the sign-in button was replaced by the dashboard button
    assert(path == root_path, "Was not correctly re-directed after login")
	
	# Test sign-out capabilities
	delete_via_redirect signout_path
	assert_response :success
  end

  test "change password" do
  end
end
