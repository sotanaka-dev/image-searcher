class YoutubeService
  include HTTParty
  base_uri 'https://www.googleapis.com/youtube/v3'

  def initialize(keyword)
    @options = {
      query: {
        key: ENV['YOUTUBE_API_KEY'],
        type: 'video',
        part: 'snippet',
        maxResults: 50,
        q: keyword
      }
    }
  end

  def parse_data(response)
    items = response['items']
    items.map do |item|
      {
        title: item['snippet']['title'],
        url: "https://www.youtube.com/watch?v=#{item['id']['videoId']}",
        image: item['snippet']['thumbnails']['high']['url']
      }
    end
  end

  def search
    response = self.class.get('/search', @options)
    parse_data(response)
  end
end
