class Schedule < ActiveRecord::Base
  belongs_to :user

	has_many :debts, :dependent => :destroy

	validates :user_id, presence: true
	validates_presence_of :user
end
