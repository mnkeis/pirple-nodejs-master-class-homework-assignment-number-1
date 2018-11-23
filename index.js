/**
 * 
 * NodeJS Master Class
 * 
 * Homework assignment #1
 * 
 * @Author: Mauro Casse
 */

// Dependencies
var http = require('http');
var url = require('url');
var { StringDecoder } = require('string_decoder');

// The server should respond to requests
const httpServer = http.createServer(function(req, res) {
  
  // Get the url and parse it
  var parsedUrl = url.parse(req.url);

  // Get the path
  var path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

  // Get the query
  var query = parsedUrl.query;
  
  // Get the http method
  var method = req.method.toLowerCase();

  // Get the headers
  var headers = req.headers;

  // Get the payload, if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer += decoder.end();

    // Choose the handler for the route
    var handler = typeof(router[method][path]) !== 'undefined' ? router[method][path] : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      'path': path,
      'query': query,
      'method': method,
      'headers': headers,
      'body': buffer
    };

    // call the handler
    handler(data, function(status, payload) {
      // default status code and payload
      res.statusCode = status || 200;
      
      var message = payload || '';

      res.setHeader('Content-Type', 'application/json');      
      res.end(JSON.stringify(message));
    });
  });
});

// Start the server on port 3000
httpServer.listen(3000, function() {
  console.log("Server listening on port 3000");
});

// Define the handlers
var handlers = {};

// Hello handler
handlers.hello = function(data, callback) {
  callback(200, {'answer': 'Hello world'});
};

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404);
};

// Define the request router
var router = {
  // Define post routes
  'post': {
    'hello': handlers.hello
  }
};
