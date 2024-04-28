class HomeController < ApplicationController
  def index
    @data = github_api.current_user_info
  end

  private

  # TODO: Add caching mechanism
  def github_api
    @github_api ||= begin
                      auth_hash = Current.omniauth_hash
                      github_access_token = auth_hash.dig(:credentials, :token)
                      owner = auth_hash.dig(:extra, :raw_info, :login)

                      GithubApi.new(bearer_token: github_access_token, owner: owner)
                    end
  end
end
