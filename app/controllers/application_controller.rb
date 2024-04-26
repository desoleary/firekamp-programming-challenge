class ApplicationController < ActionController::Base
  include Authenticable

  if Rails.env.development? || Rails.env.test?
    protect_from_forgery with: :null_session
  else
    protect_from_forgery with: :exception # helps protects against CSRF
  end

  before_action :set_current_request_details
  before_action :authenticate


  private
  def authenticate
    redirect_to sign_in_path unless authenticated? && Current.user
  end

    def set_current_request_details
      # Current.user =
      Current.user_agent = request.user_agent
      Current.ip_address = request.ip

      omniauth_auth = cookie_manager.auth0_cookie
      Current.omniauth_hash = omniauth_auth
      Current.user = User.authenticated_user
    end
end
