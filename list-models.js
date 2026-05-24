const https = require('https');
require('dotenv').config({path: '.env.local'});
const key = process.env.GEMINI_API_KEY;
if (!key) { console.error('No key'); process.exit(1); }

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.models) {
        console.log(json.models.map(m => m.name).join('\n'));
      } else {
        console.log(json);
      }
    } catch (e) {
      console.log('Error parsing JSON:', data);
    }
  });
});
