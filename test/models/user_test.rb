require 'test_helper'
require 'pp'

class UserTest < ActiveSupport::TestCase
  test "user validation" do
    user = User.new
    assert(user.save == false, "User should not have been saved.")
    user.name = "Sam McGee"
    assert(user.save == false, "User should not have been saved.")
    user.email = "sam@mcgee.com"
    assert(user.save, "User should have been saved, and wasn't")

    pp ('Check 1')
    # Test name length validation
    user = User.new(name: "abc", email: "user@example.com")
    assert(user.save == false, "User should not have been saved with a 3-letter name.")
    user.name = "abcde"
    assert(user.save, "User should have been saved, and wasn't")

    # Test for bad email
    user = User.new(name: "Mark McGee", email: "usermchgee")

    assert(user.save == false, "User should not have been saved with a bad email.")

    user.email = "sam@mgee2.com"
    assert(user.save, "User should have been saved, and wasn't")

    # Test for unique emails
    user = User.new(name: "Fred Wilber", email: "fred@foo.com")
    assert(user.save, "User was not saved when he should have")
    user = User.new(name: "Fred Wilber2", email: "fred@fOo.com")
    assert(user.save == false, "A duplicate user was saved, when he shouldn't have been.")

    # Test ensure emails are properly lower-cased
    user = User.new(name: "Fred Wilber", email: "fred@BAR.com")
    assert(user.save, "User was not saved when he should have")
    puts user.email
    assert(user.email == "fred@bar.com", "Email was not lower-cased on save")
  end
  # test "the truth" do
  #   assert true
  # end
end
