class GiphyService < BaseService
  SERVICE_NAME = 'GIPHY'.freeze
  base_uri 'https://api.giphy.com/v1/gifs'

  def build_query(keyword)
    {
      api_key: ENV.fetch('GIPHY_API_KEY', nil),
      q: keyword,
      limit: 50
    }
  end

  def parse_data(response)
    data = response['data']
    data.map do |gif|
      {
        id: gif['id'],
        title: gif['title'],
        url: gif['url'],
        image: gif['images']['downsized']['url'],
        posted_at: DateTime.parse(gif['import_datetime']).iso8601,
        service_id: self.class.service_id,
        service_name: 'GIPHY'
      }
    end
  end

  def search_endpoint
    '/search'
  end
end
