const https = require('https');

const data = JSON.stringify({ query: 'MSN' });

const options = {
  hostname: 'ecosystem-jsvo.onrender.com',
  port: 443,
  path: '/api/research',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(res.statusCode, body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
