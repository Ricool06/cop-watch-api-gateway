Feature: request/response pattern
  As a developer
  I want the request/response pattern to be supported
  So that my frontend application can use Graphql over HTTP, and the backend use sockets

  Scenario: Convert GET request to socket message and pass back response from socket
    Given another service that is listening for "GET:loadMap" events is connected to the gateway
    When I make a "loadMap" GET request to this API
    Then I should receive a good response
    And the connected service should receive a good GET request

  Scenario: Convert POST request to socket message and pass back response from socket
    Given another service that is listening for "POST:loadMap" events is connected to the gateway
    When I make a "loadMap" POST request to this API
    Then I should receive a good response
    And the connected service should receive a good POST request
