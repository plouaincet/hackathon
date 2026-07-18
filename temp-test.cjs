const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const models = [
  'accounts/fireworks/models/llama-v3.1-8b-instruct',
  'accounts/fireworks/models/llama-v3p1-8b-instruct',
  'accounts/fireworks/models/mixtral-8x7b-instruct',
  'accounts/fireworks/models/phi-3.5-mini-instruct'
];
(async () => {
  for (const model of models) {
    try {
      const res = await axios.post('https://api.fireworks.ai/inference/v1/chat/completions', {
        model,
        messages: [{ role: 'user', content: 'Say hello in one word.' }],
        max_tokens: 16
      }, {
        headers: {
          Authorization: 'Bearer ' + process.env.FIREWORKS_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      console.log('SUCCESS', model);
      console.log(JSON.stringify(res.data, null, 2));
      process.exit(0);
    } catch (err) {
      console.log('FAIL', model, err.response?.status, err.response?.data?.error?.message || err.message);
    }
  }
})();
