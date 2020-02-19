const server = require('./server');
const port = 5000;

// designates what port the app will listen to for incoming requests
server.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});