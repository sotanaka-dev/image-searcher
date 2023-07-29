class FlickrService < BaseService
  SERVICE_NAME = 'Flickr'.freeze
  base_uri 'https://api.flickr.com/services/rest'

  def build_query(keyword)
    {
      api_key: ENV.fetch('FLICKR_API_KEY', nil),
      method: 'flickr.photos.search',
      format: 'json',
      nojsoncallback: 1,
      text: keyword,
      per_page: 50,
      sort: 'interestingness-desc',
      extras: 'date_upload'
    }
  end

  def parse_data(response)
    photos = response['photos']['photo']
    photos.map do |photo|
      {
        id: photo['id'],
        title: photo['title'],
        url: "https://www.flickr.com/photos/#{photo['owner']}/#{photo['id']}",
        image: "https://live.staticflickr.com/#{photo['server']}/#{photo['id']}_#{photo['secret']}.jpg",
        posted_at: Time.at(photo['dateupload'].to_i).utc.iso8601,
        source: 'Flickr'
      }
    end
  end

  def search_endpoint
    '/'
  end
end
