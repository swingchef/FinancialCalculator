class User < ActiveRecord::Base
  validates :name, presence: true,
                   length: {minimum: 5}

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true,
                    format: { with: VALID_EMAIL_REGEX },
                    uniqueness: {case_sensitive: false}

  # Password-related fields
  has_secure_password
  has_many :schedule, :dependent => :destroy
  # validates :password, presence: { on: create }, length: {minimum: 8}
  validates :password, length: {minimum: 8},
                       allow_nil: true

  before_save { self.email = email.downcase}
  before_create :create_remember_token

  def User.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def User.hash(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  private
    def create_remember_token
      self.remember_token = User.hash(User.new_remember_token)
    end

  # TODO Make the database force unique emails as well.  This can be done by adding an index to the "email" column, and then force unique
  # http://ruby.railstutorial.org/chapters/sign-in-sign-out
end
