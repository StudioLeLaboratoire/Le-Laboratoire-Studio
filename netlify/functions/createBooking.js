const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwQIoIzjSY6adzgojN4GbFTuHkJvHdCqvAjt-ayRHOoziZZddvp6OH1UwfrEXkAAxUgNQ/exec';

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: event.body
    });
    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() })
    };
  }
};
