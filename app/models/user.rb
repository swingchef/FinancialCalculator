class User < ActiveRecord::Base
  validates :name, presence: true, length: {minimum: 5}
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, format: { with: VALID_EMAIL_REGEX }, uniqueness: {case_sensitive: false}

  before_save { self.email = email.downcase}
  # TODO Make the database force unique emails as well.  This can be done by adding an index to the "email" column, and then force unique
end
