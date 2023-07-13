class FlickrService
  include HTTParty
  base_uri 'https://api.flickr.com/services/rest'

  def initialize(keyword)
    @options = {
      query: {
        method: 'flickr.photos.search',
        api_key: ENV['FLICKR_API_KEY'],
        text: keyword,
        format: 'json',
        nojsoncallback: 1,
        per_page: 50
      }
    }
  end

  def parse_data(response)
    photos = response['photos']['photo']
    photos.map do |photo|
      {
        title: photo['title'],
        url: "https://www.flickr.com/photos/#{photo['owner']}/#{photo['id']}",
        image: "https://live.staticflickr.com/#{photo['server']}/#{photo['id']}_#{photo['secret']}.jpg"
      }
    end
  end

  def search
    response = self.class.get('/', @options)
    parse_data(response)
  end
end
