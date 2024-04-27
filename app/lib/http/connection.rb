module Http
  class Connection
    def initialize(url, bearer_token: nil, debug: false)
      @url = url
      @bearer_token =  bearer_token

      @connection = Faraday.new(url) do |f|
        f.response :logger, nil, { headers: true, bodies: true, errors: true } if debug
        f.headers['Authorization'] = "Bearer #{bearer_token}" if bearer_token.present?
        f.request :json
        f.response :json, content_type: /\bjson$/
        f.adapter Faraday.default_adapter
      end
    end

    def post(path, body = {}, headers = {})
      @connection.send(:post, path, body, headers)
    end
  end
end
