module Github
  class RepositoriesController < ApplicationController
    # POST /repositories/update
    def update
      id = repository_params[:id]

      begin
        github_api.update_repository_description(id: id, description: repository_params[:description])

        render json: { message: 'Repository updated successfully' }, status: :ok
      rescue Exception => ex
        Rails.logger.error('Unable to update GitHub repository with id: ' + id)
        Rails.logger.error(ex)

        render json: { error: 'Unable to update your GitHub repository due to an unexpected error. ' }, status: :internal_server_error
      end
    end

    private

    def repository_params
      params.require(:repository).permit(:id, :name, :description, :homepageUrl, :diskUsage, :createdAt, :updatedAt)
    end
  end
end
