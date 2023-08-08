class GiphyService < BaseService
  SERVICE_NAME = 'GIPHY'.freeze
  base_uri 'https://api.giphy.com/v1/gifs'

  def search_build_query(keyword)
    {
      api_key: ENV.fetch('GIPHY_API_KEY', nil),
      q: keyword,
      limit: 50
    }
  end

  def get_build_query(_post_id)
    {
      api_key: ENV.fetch('GIPHY_API_KEY', nil)
    }
  end

  def search_endpoint
    '/search'
  end

  def get_endpoint(post_id)
    "/#{post_id}"
  end

  def parse_search_results(response)
    data = response['data']
    data.map do |gif|
      {
        id: gif['id'],
        title: gif['title'],
        url: gif['url'],
        image: gif['images']['downsized']['url'],
        posted_at: DateTime.parse(gif['import_datetime']).utc.iso8601,
        service_id: self.class.service_id,
        service_name: SERVICE_NAME
      }
    end
  end

  def parse_single_post(response)
    gif = response['data']
    {
      title: gif['title'],
      url: gif['url'],
      image: gif['images']['downsized']['url'],
      posted_at: DateTime.parse(gif['import_datetime']).utc.iso8601,
      service_id: self.class.service_id,
      service_name: SERVICE_NAME
    }
  end
end
