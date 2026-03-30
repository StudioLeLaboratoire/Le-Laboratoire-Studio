const https = require('https');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwQIoIzjSY6adzgojN4GbFTuHkJvHdCqvAjt-ayRHOoziZZddvp6OH1UwfrEXkAAxUgNQ/exec?action=getSlots';

function getURL(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 10) return reject(new Error('Too many redirects'));
    const lib = url.startsWith('https') ? https : require('http');
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return getURL(res.headers.location, redirectCount + 1).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

exports.handler = async function(event, context) {
  try {
    const data = await getURL(APPS_SCRIPT_URL);
    const parsed = JSON.parse(data);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(parsed)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() })
    };
  }
};
