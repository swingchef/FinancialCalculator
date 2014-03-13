require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "user validation" do
    user = User.new
    assert(user.save == false, "User should not have been saved.")
    user.name = "Sam McGee"
    assert(user.save == false, "User should not have been saved.")
    user.email = "sam@mcgee.com"
    assert(user.save, "User should have been saved, and wasn't")
  end
  # test "the truth" do
  #   assert true
  # end
end
