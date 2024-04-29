class SessionsController < ApplicationController
  skip_before_action :authenticate, only: %i[ new destroy ]

  def index
  end

  def new
  end
  def destroy
    cookie_manager.destroy_session_cookies!

    reset_session

    redirect_to(root_path, notice: "That session has been logged out")
  end
end
