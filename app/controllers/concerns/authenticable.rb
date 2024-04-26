module Authenticable
  extend ActiveSupport::Concern

  included do
    def cookie_manager
      @cookie_manager ||= CookieManager.init(cookies)
    end

    def authenticated?
      cookie_manager.session_cookies.present?
    end

    def unauthenticated?
      !authenticated?
    end
  end
end

