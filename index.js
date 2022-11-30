let request = require('request');
let {google} = require('googleapis');
let key = require('./service_account.json');
const {indexing} = require("googleapis/build/src/apis/indexing");
let express = require('express');
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

let app = express();
const version = '1.0.0'
const port = 5001

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).json('OK');
})

app.get('/health', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).send('OK');
})

app.get('/version', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).send(version);
})

app.post('/pages/index', function (req, res) {
  if (typeof req.body !== 'object') {
    res.setHeader('Content-Type', 'application/json')
    res.status(500).send('Wrong request body')
  }

  const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/indexing'],
      null
  );

  const batch = Object.values(req.body);

  jwtClient.authorize(function(err, tokens) {
    if (err) {
      res.setHeader('Content-Type', 'application/json')
      res.status(500).send(err);
    }

    const items = batch.map(line => {
      return {
        'Content-Type': 'application/http',
        'Content-ID': '',
        body:
            'POST /v3/urlNotifications:publish HTTP/1.1\n' +
            'Content-Type: application/json\n\n' +
            JSON.stringify({
              url: line,
              type: 'URL_UPDATED'
            })
      };
    });

    const options = {
      url: 'https://indexing.googleapis.com/batch',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/mixed'
      },
      auth: {bearer: tokens.access_token},
      multipart: items
    };
    request(options, (err, resp, body) => {
      res.send(body);
    });
  });
})

app.listen(port, function () {
  console.log("App is running...");
});
