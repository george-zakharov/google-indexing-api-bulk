let express = require('express');
let app = express();

app.get('/', function (req, res) {
  res.status(200).json('OK');
})

app.get('/health', function (req, res) {
  res.status(200).send('OK');
})

app.post('/pages/index', function (req, res) {
  res.status(200).send(res.body);
})

let server = app.listen(5001, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});