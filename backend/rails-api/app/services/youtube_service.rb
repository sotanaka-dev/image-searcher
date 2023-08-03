class YoutubeService < BaseService
  SERVICE_NAME = 'YouTube'.freeze
  base_uri 'https://www.googleapis.com/youtube/v3'

  def search_build_query(keyword)
    {
      key: ENV.fetch('YOUTUBE_API_KEY', nil),
      type: 'video',
      part: 'snippet',
      q: keyword,
      maxResults: 50,
      order: 'viewCount'
    }
  end

  def get_build_query(post_id)
    {
      key: ENV.fetch('YOUTUBE_API_KEY', nil),
      part: 'snippet',
      id: post_id
    }
  end

  def search_endpoint
    '/search'
  end

  def get_endpoint(_post_id)
    '/videos'
  end

  def parse_search_results(response)
    items = response['items']
    items.map do |item|
      {
        id: item['id']['videoId'],
        title: item['snippet']['title'],
        url: "https://www.youtube.com/watch?v=#{item['id']['videoId']}",
        image: item['snippet']['thumbnails']['high']['url'],
        posted_at: DateTime.parse(item['snippet']['publishedAt']).utc.iso8601,
        service_id: self.class.service_id,
        service_name: SERVICE_NAME
      }
    end
  end

  def parse_single_post(response)
    item = response['items'].first
    {
      id: item['id'],
      title: item['snippet']['title'],
      url: "https://www.youtube.com/watch?v=#{item['id']}",
      image: item['snippet']['thumbnails']['high']['url'],
      posted_at: DateTime.parse(item['snippet']['publishedAt']).utc.iso8601,
      service_id: self.class.service_id,
      service_name: SERVICE_NAME
    }
  end
end
