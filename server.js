const express = require('express');
const serverless = require('serverless-http');
const puzzleRouter = require('./routes/puzzleRouter');

const app = express();

app.use('/api', puzzleRouter);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = 3001;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// For Netlify
module.exports.handler = serverless(app);