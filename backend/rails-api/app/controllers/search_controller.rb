class SearchController < ApplicationController
  before_action :authenticate_request

  def search
    keyword = params[:keyword]
    youtube_data = YoutubeService.new(keyword).search
    flickr_data = FlickrService.new(keyword).search
    giphy_data = GiphyService.new(keyword).search

    posts = [
      *youtube_data[:posts],
      *flickr_data[:posts],
      *giphy_data[:posts]
    ].sort_by! { |post| post[:posted_at] }.reverse!

    unavailable_services = [
      youtube_data[:service_name],
      flickr_data[:service_name],
      giphy_data[:service_name]
    ].compact

    render json: {
      posts:,
      unavailable_services:
    }
  end
end
