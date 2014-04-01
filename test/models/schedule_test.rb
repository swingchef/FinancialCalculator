require 'test_helper'

class ScheduleTest < ActiveSupport::TestCase
	test "Schedule requires User" do
		s = Schedule.new
		assert(s.save == false, "Should not have saved schedule without a valid user_id")
		one = User.find_by(name: "MyString")
		s.user_id = one.id
		assert(s.save == true, "Should have saved correctly")
	end
  # test "the truth" do
  #   assert true
  # end
end
