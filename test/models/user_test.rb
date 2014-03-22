require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "user validation" do
    user = createValidUser()
    user.name = ""
    assert(user.save == false, "User should require a non-empty name before saving.")
    user.name = "Sam McGee"
    user.email = ""
    assert(user.save == false, "User should require a non-empty email before saving.")
    user.email = "sam@mcgee.com"
    user.password = nil
    user.password_confirmation = nil
    user.password_digest = nil
    assert(user.save == false, "User should require a non-empty password before saving.")
    user.password = "mypassword"
    user.password_confirmation = ""
    assert(user.save == false, "User should not be saved without a matching password_confirmation.")
    user.password = "mypass"
    user.password_confirmation = "mypass"
    assert(user.save == false, "User should not be saved when the password is less than eight characters.")
    user.password = "mypassword"
    user.password_confirmation = "mypassword"

    # Test name length validation
    user.name = "abc"
    assert(user.save == false, "User should not have been saved with a 3-letter name.")
    user.name = "abcde"

    # Finally, ensure a correct save works
    user.email = "yabba@DABBA.com"
    assert(user.save, "User should have been saved, and wasn't")

    # Test ensure emails are properly lower-cased
    assert(user.email == "yabba@dabba.com", "Email was not correctly lower-cased on save")

    # Test for bad email
    user.email = "usermchgee"
    assert(user.save == false, "User should not have been saved with a bad email.")
    user.email = "sam@mgee2.com"


    # Test for unique emails
    user = createValidUser()
    user.email = "not@unique.com"
    assert(user.save, "User was not saved when he should have")
    user = createValidUser()
    user.email = "not@unique.com"
    assert(user.save == false, "A duplicate user was saved, when he shouldn't have been.")

  end

  test "Find By Email" do
    user = createValidUser()
    myEmail = user.email
    user.save
    resultingUser = User.find_by(email: myEmail)
    assert(user == resultingUser, "The resulting user should be the same")

    assert(User.find_by(email: "badEmail@here.com") == nil, "Somehow found a non-existant user...")
  end

  test "Verify user remember token" do
	  user = createValidUser()
	  user.save
	  assert(!user.remember_token.nil? && user.remember_token != "", "User did not receive a valid remember_token upon creation")
  end

  def createValidUser()
    user = User.new(name: "Fred Wilber", email: "fred@bar.com", password: "mypassword", password_confirmation: "mypassword")
    return user
  end
end
