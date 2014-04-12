require 'test_helper'

class ScheduleTest < ActiveSupport::TestCase
	test "Schedule requires User" do
		s = Schedule.new
		assert(s.save == false, "Should not have saved schedule without a valid user_id")

		# use a bad user_id
		s.user_id = "5555555"
		assert(s.save == false, "Invalid user_id should have failed the save")

		s.user_id = users(:goodUser).id
		assert(s.save == true, "Should have saved correctly")
	end
end
