class ApplicationController < ActionController::Base
  if Rails.env.development? || Rails.env.test?
    protect_from_forgery with: :null_session
  else
    protect_from_forgery with: :exception # helps protects against CSRF
  end

  before_action :set_current_request_details
  before_action :authenticate

  private
    def authenticate
      if session_record = Session.find_by_id(cookies.signed[:session_token])
        Current.session = session_record
      else
        redirect_to sign_in_path
      end
    end

    def set_current_request_details
      Current.user_agent = request.user_agent
      Current.ip_address = request.ip
    end
end
