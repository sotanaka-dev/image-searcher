Sentry.init do |config|
  config.dsn = 'https://1895b23a76ed2ab12dbb5fa0df4360d4@o4505459226247168.ingest.sentry.io/4505611666915328'
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]

  # Set traces_sample_rate to 1.0 to capture 100%
  # of transactions for performance monitoring.
  # We recommend adjusting this value in production.
  config.traces_sample_rate = 1.0
  # or
  config.traces_sampler = lambda do |_context|
    true
  end
end
