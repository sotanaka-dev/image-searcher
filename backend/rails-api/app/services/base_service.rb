class BaseService
  include HTTParty

  def initialize(keyword)
    @options = {
      query: build_query(keyword)
    }
  end

  def search
    response = self.class.get(search_endpoint, @options)
    { posts: parse_data(response), service_name: nil }
  rescue StandardError => e
    Rails.logger.error "#{self.class::SERVICE_NAME} Error: #{e.message}"
    { posts: [], service_name: self.class::SERVICE_NAME }
  end

  def build_query(keyword)
    raise NotImplementedError
  end

  def parse_data(response)
    raise NotImplementedError
  end

  def search_endpoint
    raise NotImplementedError
  end
end
