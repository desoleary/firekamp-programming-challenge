class HomeController < ApplicationController
  def index
    @data = github_api.current_user_info
  end
end
