class GithubApi
  ENDPOINT = 'https://api.github.com/graphql'

  def initialize(bearer_token:, owner:)
    raise ArgumentError "bearer_token must be filled" if bearer_token.blank?
    raise ArgumentError "Github owner must be filled" if owner.blank?

    @owner = owner
    @connection = Http::Connection.new(ENDPOINT, bearer_token: bearer_token)
  end

  def current_user_info(repositories_filter: '')
    response_body = execute_query(:GetCurrentUserInfo)
    user_info = response_body.dig(:data, :viewer)
    repositories = repositories_by_name(repositories_filter)
    user_info.merge(repositories: repositories)
  end

  def repositories_by_name(name = '')
    response_body = execute_query(:RepositoriesSearchByName, schemaParams: [@owner, name])
    response_body.dig(:data, :search, :edges).pluck(:node)
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

  def execute_query(identifier, variables = {}, schemaParams: [])
    identifier = identifier.to_sym if identifier.is_a?(String)
    query = queries[identifier]
    query = query.call(*schemaParams) if query.is_a?(Proc)

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
      RepositoriesSearchByName: lambda do |owner, search|
        <<~GRAPHQL
        query {
          search(query: "owner:#{owner} sort:updated-desc #{search}", type: REPOSITORY, first: 20) {
            repositoryCount
            edges {
              node {
                ... on Repository {
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
            }
          }
        }
      GRAPHQL
      end
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
