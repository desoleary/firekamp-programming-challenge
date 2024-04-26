class Current < ActiveSupport::CurrentAttributes
  attribute :user
  attribute :user_agent, :ip_address
  attribute :omniauth_hash

  delegate :email, to: :user, allow_nil: true
end
