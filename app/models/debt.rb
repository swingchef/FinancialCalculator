class Debt < ActiveRecord::Base
	# Schedule relationship
	belongs_to :schedule
	validates :schedule_id, presence: true
	validates_presence_of :schedule

	# Validation for the name field
	validates :name, presence: true,
									 length: {minimum: 1}

	# Validation for the amount field
	validates :amount, presence: true,
										 :numericality => { :greater_than_or_equal_to => 0 }

	# Validation for the interest field
	validates :interest_rate, presence: true,
										 :numericality => { :greater_than_or_equal_to => 0 }

	# Validation for the minimum monthly payment field
	validates :min_monthly_payment, presence: true,
										 :numericality => { :greater_than_or_equal_to => 0 }
end
