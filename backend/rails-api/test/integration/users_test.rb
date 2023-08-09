require "test_helper"

class UsersTest < ActionDispatch::IntegrationTest
  setup do
    @user_attributes = { username: SecureRandom.alphanumeric(10), password: Faker::Internet.password(min_length: 8) }
    @url = '/users'
  end

  test 'should register new user with valid data' do
    assert_difference 'User.count', 1 do
      post @url, params: { user: @user_attributes }, as: :json
    end

    json_response = JSON.parse(@response.body)
    assert_equal @user_attributes[:username], json_response['user']['username']
    assert_not_nil json_response['user']['token']
    assert_response :created
  end

  test 'should not register new user without username' do
    @user_attributes.delete(:username)

    assert_no_difference 'User.count' do
      post @url, params: { user: @user_attributes }, as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'should not register new user without password' do
    @user_attributes.delete(:password)

    assert_no_difference 'User.count' do
      post @url, params: { user: @user_attributes }, as: :json
    end

    assert_response :unprocessable_entity
  end

  test 'should not register new user with duplicate username' do
    User.create!(username: @user_attributes[:username], password: Faker::Internet.password(min_length: 8))

    assert_no_difference 'User.count' do
      post @url, params: { user: @user_attributes }, as: :json
    end

    assert_response :unprocessable_entity
  end
end
