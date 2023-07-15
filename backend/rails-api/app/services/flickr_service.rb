class FlickrService
  include HTTParty
  base_uri 'https://api.flickr.com/services/rest'

  def initialize(keyword)
    @options = {
      query: {
        api_key: ENV['FLICKR_API_KEY'],
        method: 'flickr.photos.search',
        format: 'json',
        nojsoncallback: 1,
        text: keyword,
        per_page: 50,
        sort: 'interestingness-desc',
        extras: 'date_upload'
      }
    }
  end

  def parse_data(response)
    photos = response['photos']['photo']
    photos.map do |photo|
      {
        title: photo['title'],
        url: "https://www.flickr.com/photos/#{photo['owner']}/#{photo['id']}",
        image: "https://live.staticflickr.com/#{photo['server']}/#{photo['id']}_#{photo['secret']}.jpg",
        posted_at: Time.at(photo['dateupload'].to_i).utc.iso8601,
        source: 'Flickr'
      }
    end
  end

  def search
    response = self.class.get('/', @options)
    parse_data(response)
  end
end
