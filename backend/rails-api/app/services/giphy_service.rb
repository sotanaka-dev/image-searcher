class GiphyService < BaseService
  SERVICE_NAME = 'GIPHY'
  base_uri 'https://api.giphy.com/v1/gifs'

  def build_query(keyword)
    {
      api_key: ENV['GIPHY_API_KEY'],
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
        source: 'GIPHY'
      }
    end
  end

  def search_endpoint
    '/search'
  end
end
