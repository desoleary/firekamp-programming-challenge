OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, ENV['FIREKAMP_GITHUB_CLIENT_ID'], ENV['FIREKAMP_GITHUB_CLIENT_SECRET'], scope: 'user:email,public_repo'

  # Handles authentication failures not captured outside of the controller
  on_failure do |env|
    auth_error = env['omniauth.error']
    auth_strategy = env['omniauth.error.strategy']

    request_params = auth_strategy.request.params.symbolize_keys
    provider = auth_strategy.name
    error_message = request_params[:error] || auth_error.message
    error_description = request_params[:error_description]

    # Logs error details.
    log_message = "ERROR -- omniauth: (#{provider}) Authentication failure! #{auth_error.class}, #{error_message}}"
    log_message += " #{error_description}" if error_description.present?
    Rails.logger.error log_message

    # Sets a flash message for the user.
    env['rack.session']['flash'] = ActionDispatch::Flash::FlashHash.new(alert: 'Authentication failure! - Please contact support at support@firekamp.com').to_session_value

    # Redirects to the sign-in path.
    response = Rack::Response.new(nil, 302)
    response.redirect(Rails.application.routes.url_helpers.sign_in_path, 302)
    response.finish
  end
end
