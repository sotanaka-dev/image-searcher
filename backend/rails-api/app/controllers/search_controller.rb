class SearchController < ApplicationController
  before_action :authenticate_request

  def search
    keyword = params[:keyword]
    selected_services = params[:services]&.split(",") || []

    posts = []
    unavailable_services = []

    service_classes = [YoutubeService, FlickrService, GiphyService]

    service_classes.each do |service_class|
      next unless selected_services.include?(service_class::SERVICE_NAME.downcase)

      service_data = service_class.new(keyword).search_posts
      posts.concat(service_data[:posts])
      unavailable_services << service_data[:service_name]
    end

    posts.sort_by! { |post| post[:posted_at] }.reverse!

    render json: {
      posts:,
      unavailable_services: unavailable_services.compact
    }
  end
end
