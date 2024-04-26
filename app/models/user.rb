class User < ApplicationRecord
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  normalizes :email, with: -> { _1.strip.downcase }

  class << self
    def find_or_initialize_by_omniauth
      User.authenticated_users.first_or_initialize
    end

    def authenticated_users
      where(omniauth_params)
    end

    def authenticated_user
      authenticated_users.first
    end

    private

    def omniauth_params
      auth = Current.omniauth_hash
      return nil unless auth.present?

      { provider: auth[:provider], uid: auth[:uid], email: auth.dig(:info, :email) }
    end
  end
end
