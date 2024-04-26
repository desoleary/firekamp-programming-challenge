class CookieManager
  DEFAULT_EXPIRY = 24.hours.from_now

  module Key
    AUTH0 = :auth0_firekamp
    SESSION_KEYS = [AUTH0].freeze
  end

  def initialize(cookies)
    @cookies = cookies
  end

  class << self
    def init(cookies)
      new(cookies)
    end
  end

  def session_cookies
    cookie_pairs_for(Key::SESSION_KEYS)
  end
  def destroy_session_cookies!
    Key::SESSION_KEYS.each do |key|
      destroy_cookie(key)
    end

    self
  end

  # Individual cookie functionality

  def auth0_cookie
    get(Key::AUTH0)
  end

  def with_auth0_cookie(auth_hash)
    raise ArgumentError.new('auth_hash is required') if auth_hash.blank?

    create(Key::AUTH0, auth_hash.symbolize_keys)

    self
  end

  def with_session_token(session)
    @cookies.signed.permanent[:session_token] = { value: session.id, httponly: true }
  end

  private

  def create(key, value, expires_in: DEFAULT_EXPIRY)
    @cookies.encrypted[key] = { value: value, expires: expires_in, httponly: true }
  end

  def get(key)
    value = @cookies.encrypted[key]
    value = value.with_indifferent_access if value.is_a?(Hash)
    value
  end

  def destroy_cookie(key)
    @cookies.delete(key)
  end

  def cookie_pairs_for(keys)
    hash = keys.inject({}) do |memo, key|
      value = get(key)
      memo[key] = value if value.present?
      memo
    end
    hash
  end
end
