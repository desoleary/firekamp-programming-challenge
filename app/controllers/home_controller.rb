class HomeController < ApplicationController
  def index
    @data = github_api.current_user_info(repositories_filter: search_params[:repositoriesFilter])
  end

  def search_params
    params.permit(:repositoriesFilter)
  end
end
