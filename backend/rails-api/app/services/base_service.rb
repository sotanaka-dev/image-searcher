class BaseService
  include HTTParty

  def initialize(keyword = nil)
    @keyword = keyword
  end

  def self.service_id
    @service_id ||= Service.find_by(name: self::SERVICE_NAME)&.id
  end

  def search_build_query(keyword)
    raise NotImplementedError
  end

  def get_build_query(post_id)
    raise NotImplementedError
  end

  def search_endpoint
    raise NotImplementedError
  end

  def get_endpoint(post_id)
    raise NotImplementedError
  end

  def parse_search_results(response)
    raise NotImplementedError
  end

  def parse_single_post(response)
    raise NotImplementedError
  end

  def search_posts
    options = { query: search_build_query(@keyword) }
    response = self.class.get(search_endpoint, options)
    { posts: parse_search_results(response), service_name: nil }
  rescue StandardError => e
    Rails.logger.error "#{self.class::SERVICE_NAME} Error: #{e.message}"
    { posts: [], service_name: self.class::SERVICE_NAME }
  end

  def get_single_post(post_id)
    options = { query: get_build_query(post_id) }
    response = self.class.get(get_endpoint(post_id), options)
    { post: parse_single_post(response), service_name: nil }
  rescue StandardError => e
    Rails.logger.error "#{self.class::SERVICE_NAME} Error: #{e.message}"
    { post: nil, service_name: self.class::SERVICE_NAME }
  end
end
