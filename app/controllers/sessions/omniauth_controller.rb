# frozen_string_literal: true

module Sessions
  class OmniauthController < ApplicationController
    skip_before_action :verify_authenticity_token
    skip_before_action :authenticate

    def create
      cookie_manager.with_auth0_cookie(request.env["omniauth.auth"].except(:extra))
      Current.omniauth_hash = cookie_manager.auth0_cookie

      @user = User.find_or_initialize_by_omniauth

      if @user.save

        redirect_to root_path, notice: 'Signed in successfully'
      else
        redirect_to sign_in_path, alert: "Authentication failed with error '#{@user.errors.full_messages.first}'"
      end
    end

    def failure
      redirect_to sign_in_path, alert: params[:message]
    end

    private

    def omniauth
      request.env['omniauth.auth']
    end
  end
end
