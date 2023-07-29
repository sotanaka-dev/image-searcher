require "test_helper"

class AuthenticationTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(username: SecureRandom.alphanumeric(10), password: 'validpassword')
    @sign_in_url = '/users/signin'
  end

  test 'should sign in with valid credentials' do
    sign_in_params = { username: @user.username, password: 'validpassword' }

    post @sign_in_url, params: { user: sign_in_params }

    assert_response :ok
    assert_not_nil JSON.parse(@response.body)['user']['token']
  end

  test 'should not sign in with invalid password' do
    sign_in_params = { username: @user.username, password: 'invalidpassword' }

    post @sign_in_url, params: { user: sign_in_params }

    assert_response :unauthorized
  end

  test 'should not sign in with non-existent username' do
    sign_in_params = { username: 'nonexistentusername', password: 'validpassword' }

    post @sign_in_url, params: { user: sign_in_params }

    assert_response :unauthorized
  end
end
