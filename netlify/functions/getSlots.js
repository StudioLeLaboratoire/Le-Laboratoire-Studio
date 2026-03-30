const https = require('https');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwQIoIzjSY6adzgojN4GbFTuHkJvHdCqvAjt-ayRHOoziZZddvp6OH1UwfrEXkAAxUgNQ/exec?action=getSlots';

function getURL(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 302 && res.headers.location) {
          getURL(res.headers.location).then(resolve).catch(reject);
        } else {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

exports.handler = async function(event, context) {
  try {
    const data = await getURL(APPS_SCRIPT_URL);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() })
    };
  }
};
