const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
(async () => {
  try {
    const res = await axios.post('https://api.fireworks.ai/inference/v1/chat/completions', {
      model: 'accounts/fireworks/models/llama-v3.1-8b-instruct',
      messages: [{ role: 'user', content: 'Say hello in one word.' }],
      max_tokens: 32
    }, {
      headers: {
        Authorization: 'Bearer ' + process.env.FIREWORKS_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('STATUS', err.response?.status);
    console.error(JSON.stringify(err.response?.data, null, 2));
  }
})();
