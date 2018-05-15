var express = require('express'),
  // NOTE: require in our request proxy module
  port = process.env.PORT || 3000,
  app = express();

app.use(express.static('./'));

app.get('/', function(request, response) {
  console.log('New request:', request.url);
  response.sendFile('index.html', { root: '.' });
});

app.get('/templates/:template', function (req, res) {
  console.log(req.params.name );
  req.sendFile('tempates/' + req.params.name, { root: __dirname });
});

app.listen(port, function() {
  console.log('Server started on port ' + port + '!');
});
