class YoutubeService < BaseService
  SERVICE_NAME = 'YouTube'
  base_uri 'https://www.googleapis.com/youtube/v3'

  def build_query(keyword)
    {
      key: ENV['YOUTUBE_API_KEY'],
      type: 'video',
      part: 'snippet',
      q: keyword,
      maxResults: 50,
      order: 'viewCount'
    }
  end

  def parse_data(response)
    items = response['items']
    items.map do |item|
      {
        title: item['snippet']['title'],
        url: "https://www.youtube.com/watch?v=#{item['id']['videoId']}",
        image: item['snippet']['thumbnails']['high']['url'],
        posted_at: item['snippet']['publishTime'],
        source: 'YouTube'
      }
    end
  end

  def search_endpoint
    '/search'
  end
end
