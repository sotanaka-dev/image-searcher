class FlickrService < BaseService
  SERVICE_NAME = 'Flickr'.freeze
  base_uri 'https://api.flickr.com/services/rest'

  def search_build_query(keyword)
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

  def get_build_query(post_id)
    {
      api_key: ENV.fetch('FLICKR_API_KEY', nil),
      method: 'flickr.photos.getInfo',
      format: 'json',
      nojsoncallback: 1,
      photo_id: post_id
    }
  end

  def search_endpoint
    '/'
  end

  def get_endpoint(_post_id)
    '/'
  end

  def parse_search_results(response)
    photos = response['photos']['photo']
    photos.map do |photo|
      {
        post_id: photo['id'],
        title: photo['title'],
        url: "https://www.flickr.com/photos/#{photo['owner']}/#{photo['id']}",
        image: "https://live.staticflickr.com/#{photo['server']}/#{photo['id']}_#{photo['secret']}.jpg",
        posted_at: Time.at(photo['dateupload'].to_i).utc.iso8601,
        service_id: self.class.service_id,
        service_name: SERVICE_NAME
      }
    end
  end

  def parse_single_post(response)
    photo = response['photo']
    {
      post_id: photo['id'],
      title: photo['title']['_content'],
      url: "https://www.flickr.com/photos/#{photo['owner']['path_alias']}/#{photo['id']}",
      image: "https://live.staticflickr.com/#{photo['server']}/#{photo['id']}_#{photo['secret']}.jpg",
      posted_at: Time.at(photo['dates']['posted'].to_i).utc.iso8601,
      service_id: self.class.service_id,
      service_name: SERVICE_NAME
    }
  end
end
