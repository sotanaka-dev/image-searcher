# Use this code snippet in your app.
# If you need more information about configurations or implementing the sample code, visit the AWS docs:
# https://aws.amazon.com/developer/language/ruby/

require 'aws-sdk-secretsmanager'

def get_secret(secret_id)
  client = Aws::SecretsManager::Client.new(region: 'ap-northeast-1')

  begin
    get_secret_value_response = client.get_secret_value(secret_id:)
  rescue StandardError => e
    # For a list of exceptions thrown, see
    # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    Rails.logger.error("An error occurred while getting the secret: #{e.message}")
    raise e
  end

  get_secret_value_response.secret_string
end

if Rails.env.production?
  rds_connection = get_secret('RdsConnection')
  db_config = JSON.parse(rds_connection)
  ENV['DB_PASSWORD'] = db_config['password']
  ENV['DB_HOST'] = db_config['host']

  api_keys = get_secret('ApiKey')
  api_keys_config = JSON.parse(api_keys)
  ENV['YOUTUBE_API_KEY'] = api_keys_config['YOUTUBE']
  ENV['FLICKR_API_KEY'] = api_keys_config['FLICKR']
  ENV['GIPHY_API_KEY'] = api_keys_config['GIPHY']
end
