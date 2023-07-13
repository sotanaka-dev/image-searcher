class SearchController < ApplicationController
  def search
    keyword = params[:keyword] || 'test'
    youtube_service = YoutubeService.new(keyword)
    flickr_service = FlickrService.new(keyword)
    giphy_service = GiphyService.new(keyword)

    response = {
      youtube: youtube_service.search,
      flickr: flickr_service.search,
      giphy: giphy_service.search
    }

    render json: response
  end
end
