class GithubApi
  ENDPOINT = 'https://api.github.com/graphql'

  def initialize(bearer_token:, owner:)
    raise ArgumentError "bearer_token must be filled" if bearer_token.blank?
    raise ArgumentError "Github owner must be filled" if owner.blank?

    @owner = owner
    @connection = Http::Connection.new(ENDPOINT, bearer_token: bearer_token)
  end

  def current_user_info
    response_body = execute_query(:GetCurrentUserInfo)
    response_body.dig(:data, :viewer)
  end

  def repositories
    response_body = execute_query(:ListRepositories)
    response_body.dig(:data, :viewer, :repositories, :nodes)
  end

  def repository_by_name(name)
    response_body = execute_query(:FindByName, { name: name })
    response_body.dig(:data, :repository)
  end

  def update_repository_description(id:, description:)
    response_body = execute_mutation(:UpdateRepository, { repositoryId: id, description: description })
    Rails.logger.info('response_body: ' + response_body.to_json)
    response_body.dig(:data, :updateRepository, :repository)
  end

  private

  def execute_query(identifier, variables = {})
    identifier = identifier.to_sym if identifier.is_a?(String)
    query = queries[identifier]

    raise ArgumentError "no query matching identifier '#{identifier}'. Must be one of #{queries.keys}" if query.blank?

    response = @connection.post(nil, { query: query, variables: variables })
    response.body&.deep_symbolize_keys
  end

  def execute_mutation(identifier, variables = {})
    identifier = identifier.to_sym if identifier.is_a?(String)
    query = mutations[identifier]

    raise ArgumentError "no mutation query matching identifier '#{identifier}'. Must be one of #{mutations.keys}" if query.blank?

    response = @connection.post(nil, { query: query, variables: variables })
    response.body&.deep_symbolize_keys
  end

  def queries
    @queries ||= {
      GetCurrentUserInfo: <<~GRAPHQL,
        query {
          viewer {
            id
            login
            email
            avatarUrl
            projectsUrl
            url
            websiteUrl
            repositories(first: 20, orderBy: {field: CREATED_AT, direction: DESC}) {
              nodes {
                id
                name
                description
                homepageUrl
                diskUsage
                createdAt
                updatedAt
              }
            }
          }
        }
      GRAPHQL
      FindByName: <<~GRAPHQL,
        query FindRepository($name: String!) {
          repository(owner: "#{@owner}", name: $name) {
            id
            name
            description
            createdAt
            updatedAt
            primaryLanguage {
              name
            }
            stargazerCount
            forkCount
            url
          }
        }
      GRAPHQL
      ListRepositories: <<~GRAPHQL,
      query {
        viewer {
          repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              id
              name
              description
              createdAt
              updatedAt
            }
          }
        }
      }
    GRAPHQL
    }
  end

  def mutations
    @mutations ||= {
      UpdateRepository: <<~GRAPHQL,
        mutation UpdateRepository($repositoryId: ID!, $description: String!) {
            updateRepository(input: {repositoryId: $repositoryId, description: $description}) {
              repository {
                id
                name
                description
              }
            }
          }
      GRAPHQL
    }
  end
end
