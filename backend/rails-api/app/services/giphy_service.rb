class GiphyService
  include HTTParty
  base_uri 'https://api.giphy.com/v1/gifs'

  def initialize(keyword)
    @options = {
      query: {
        api_key: ENV['GIPHY_API_KEY'],
        q: keyword,
        limit: 50
      }
    }
  end

  def parse_data(response)
    data = response['data']
    data.map do |gif|
      {
        title: gif['title'],
        url: gif['url'],
        image: gif['images']['downsized']['url'],
        posted_at: DateTime.parse(gif['import_datetime']).iso8601,
        source: 'GIPHY'
      }
    end
  end

  def search
    response = self.class.get('/search', @options)
    parse_data(response)
  end
end
