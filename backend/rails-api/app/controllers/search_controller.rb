class SearchController < ApplicationController
  def search
    keyword = params[:keyword]
    youtube = YoutubeService.new(keyword)
    flickr = FlickrService.new(keyword)
    giphy = GiphyService.new(keyword)

    response = [
      *youtube.search,
      *flickr.search,
      *giphy.search
    ].sort_by! { |post| post[:posted_at] }.reverse!

    render json: response
  end
end
