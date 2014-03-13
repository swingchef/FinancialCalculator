require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "user validation" do
    user = User.new
    assert(user.save == false, "User should not have been saved.")
    user.name = "Sam McGee"
    assert(user.save == false, "User should not have been saved.")
    user.email = "sam@mcgee.com"
    assert(user.save, "User should have been saved, and wasn't")

    # Test name length validation
    user = User.new(name: "abc", email: "user@example.com")
    assert(user.save == false, "User should not have been saved with a 3-letter name.")
    user.name = "abcde"
    assert(user.save, "User should have been saved, and wasn't")

    # Test for bad email
    user = User.new(name: "Mark McGee", email: "usermchgee")

    assert(user.save == false, "User should not have been saved with a bad email.")

    user.email = "sam@mgee.com"
    assert(user.save, "User should have been saved, and wasn't")
  end
  # test "the truth" do
  #   assert true
  # end
end
