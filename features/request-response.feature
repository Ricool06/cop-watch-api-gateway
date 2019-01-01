Feature: request/response pattern
  As a developer
  I want the request/response pattern to be supported
  So that my frontend application can use Graphql over HTTP, and the backend use sockets

  Scenario: Convert GET request to socket message and pass back response from socket
    Given another service that is listening for "map:load" events is connected to the gateway
    When I make a "map:load" request to this API
    Then the connected service should receive a good request
    And I should receive a good response
